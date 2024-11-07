import { CheerioAPI } from 'cheerio';
import { parseNumberFromSelector } from './utils/helper';

import { ProductDetails } from './types/ProductDetails';
import { ProductAttribute } from './types/ProductAttribute';

/**
 * CSS selectors for the product details
 */
const SELECTORS = {
  TITLE: 'span#productTitle',
  PRICE_WHOLE: 'span.priceToPay .a-price-whole',
  PRICE_FRACTION: 'span.priceToPay .a-price-fraction',
  LIST_PRICE: 'span.basisPrice .a-offscreen',
  REVIEW_RATING: '#acrPopover a > span',
  REVIEW_COUNT: '#acrCustomerReviewText',
  IMAGES: '#altImages .item img',
  PRODUCT_ATTRIBUTE_ROWS: '#productOverview_feature_div tr',
  ATTRIBUTES_LABEL: 'td:nth-of-type(1) span',
  ATTRIBUTES_VALUE: 'td:nth-of-type(2) span',
} as const;

/**
 * Scrapes the product details from the given Cheerio object.
 */
export const extractProductDetails = ($: CheerioAPI): ProductDetails => {
  const title = $(SELECTORS.TITLE).text().trim();

  const price = Number(
    $(SELECTORS.PRICE_WHOLE).first().text() + $(SELECTORS.PRICE_FRACTION).first().text()
  );
  const listPrice = parseNumberFromSelector($, SELECTORS.LIST_PRICE);

  const reviewRating = parseNumberFromSelector($, SELECTORS.REVIEW_RATING);
  const reviewCount = parseNumberFromSelector($, SELECTORS.REVIEW_COUNT);

  return { title, price, listPrice, reviewRating, reviewCount };
};

/**
 * Extracts the product image URLs from the given Cheerio object.
 * - We have to iterate over the image elements and extract the `src` attribute.
 */
export const extractImageUrls = ($: CheerioAPI): string[] => {
  const imageUrls = $(SELECTORS.IMAGES)
    .map((_, imageElement) => $(imageElement).attr('src'))
    .get();

  return imageUrls;
};

/**
 * Extracts the product attributes from the given Cheerio object.
 * - We have to iterate over the attribute rows and extract both label and value for each row.
 */
export const extractProductAttributes = ($: CheerioAPI): ProductAttribute[] => {
  const attributeRowElements = $(SELECTORS.PRODUCT_ATTRIBUTE_ROWS).get();

  const attributeRows = attributeRowElements.map((attributeRowElement) => {
    const label = $(attributeRowElement).find(SELECTORS.ATTRIBUTES_LABEL).text().trim();
    const value = $(attributeRowElement).find(SELECTORS.ATTRIBUTES_VALUE).text().trim();

    return { label, value };
  });

  return attributeRows;
};
