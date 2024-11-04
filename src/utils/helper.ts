import { CheerioAPI } from "cheerio";

/**
 * Parses a number from a string by removing all non-numeric characters.
 * - Keeps the decimal point.
 */
const parseNumberValue = (rawString: string): number => {
	return Number(rawString.replace(/[^\d.]+/g, ''));
};

export const parseNumberFromSelector = ($: CheerioAPI, selector: string): number => {
	const rawValue = $(selector).first().text().trim();

	return parseNumberValue(rawValue);
}