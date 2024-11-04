import { CheerioCrawlingContext, CheerioCrawler, log, Dataset } from 'crawlee';
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
 * - Alternatively, we could use a full browser crawler like `PlaywrightCrawler` to imitate a real browser.
 */
const crawler = new CheerioCrawler({ requestHandler });

const runCrawler = async () => {
  await crawler.run(urls);

  // Export the data to a CSV file
  // const dataset = await Dataset.open();
  // await dataset.exportToCSV('output.csv');
};

runCrawler().catch((error) => {
  log.error('Crawler failed', { error });
});
