import { CheerioCrawlingContext, CheerioCrawler, log, Dataset } from 'crawlee';
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';


import { extractProductDetails, extractImageUrls, extractProductAttributes } from './scraper.js';
import { handleCaptchaBlocking } from 'src/utils/block-detection.js';

// Load environment variables from .env file
dotenvConfig();

/**
 * Performs the logic of the crawler. It is called for each URL to crawl.
 * - Passed to the crawler using the `requestHandler` option.
 */
const requestHandler = async (context: CheerioCrawlingContext) => {
  const { $, request } = context;
  const url = request.url;

  handleCaptchaBlocking($ as any);

  log.info(`Scraping product page`, { url });
  const extractedProductDetails = extractProductDetails($ as any);

  log.info(`Scraping product image urls`, { url });
  let imageUrls = extractImageUrls($ as any);

  log.info(`Scraping product attributes`, { url });
  const attributes = extractProductAttributes($ as any);

  let crawledData = {
    title: extractedProductDetails.title,
    price: extractedProductDetails.price,
    listPrice: extractedProductDetails.listPrice,
    reviewRating: extractedProductDetails.reviewRating,
    reviewCount: extractedProductDetails.reviewCount,
    imageUrls,
    attributes
  };

  log.info(`Scraped product details for "${extractedProductDetails.title}", saving...`, { url });
  crawler.pushData(crawledData);
};

/**
 * Configuration for the crawler.
 */
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, `../configs/config.${env}.json`);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const urls = config.urls;

/**
 * The crawler instance. Crawlee provides a few different crawlers, but we'll use CheerioCrawler, as it's very fast and simple to use.
 */
const crawler = new CheerioCrawler({ requestHandler });

const program = new Command();

program
  .name('amazon-web-crawler')
  .description('CLI to crawl amazon products')
  .version('1.0.0');

program
  .command('crawl')
  .description('Crawl amazon products')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'urls',
        message: 'Enter additional URLs to crawl (space-separated):',
      },
      {
        type: 'confirm',
        name: 'exportToCSV',
        message: 'Do you want to export the results to a CSV file?',
        default: false,
      },
    ]);

    // Update URLs based on user input
    const additionalUrls = answers.urls ? answers.urls.split(' ').filter((url: string) => url.trim() !== '') : [];
    urls.push(...additionalUrls);

    await crawler.run(urls).catch((error) => {
      log.error('Crawler failed', { error });
    });

    if (answers.exportToCSV) {
      const dataset = await Dataset.open();
      const csvFilePath = path.resolve(__dirname, '../output.csv');
      await dataset.exportToCSV(csvFilePath);

      log.info(`Results exported to ${csvFilePath}`);
    }
  });

program.parse(process.argv);
