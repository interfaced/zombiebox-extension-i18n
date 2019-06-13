const {iterateCLDRData, generateImport, generateDataModule, convertJSONValueToAST} = require('../utils');

/**
 * @param {string} locale
 * @param {Object} input
 * @return {Object}
 */
function processCurrenciesData(locale, input) {
	const output = {};

	const currencies = input.main[locale].numbers.currencies;

	Object.keys(currencies)
		.forEach((currency) => {
			const data = currencies[currency];

			// If the currency does not have a dedicated symbol data.symbol will be either empty
			// or contain currency name.
			// Since we're going to fallback to currency name anyway, might as well skip it and save space.
			if ((!data.symbol || currency === data.symbol) && !data['symbol-alt-narrow']) {
				return;
			}

			output[currency] = {};

			if (data.symbol !== currency) {
				output[currency].symbol = data.symbol;
			}

			if (data.hasOwnProperty('symbol-alt-narrow')) {
				output[currency].narrowSymbol = data['symbol-alt-narrow'];
			}
		});

	return output;
}

/**
 * @param {string} locale
 * @param {Object} input
 * @return {Object}
 */
function processNumbersData(locale, input) {
	const output = {};

	const numbers = input.main[locale].numbers;
	const numberingSystem = numbers.defaultNumberingSystem;

	output.delimiters = {};
	output.delimiters.decimal = numbers[`symbols-numberSystem-${numberingSystem}`].decimal;
	output.delimiters.group = numbers[`symbols-numberSystem-${numberingSystem}`].group;

	let currencyFormat = numbers[`currencyFormats-numberSystem-${numberingSystem}`].standard;

	// See http://cldr.unicode.org/translation/number-patterns
	currencyFormat = currencyFormat.split(';')[0]; // This ignores cases when negative numbers are formatted differently
	currencyFormat = currencyFormat.replace(/[.,0#%E']+/, '[value]'); // This ignores escaped symbols
	currencyFormat = currencyFormat.replace('¤', '[symbol]');

	output.currency = currencyFormat;

	return output;
}

const generator = {
	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateCurrencies(locales) {
		const data = {};

		for (const [locale, localeData] of iterateCLDRData('cldr-numbers-modern', 'currencies.json', locales)) {
			data[locale] = convertJSONValueToAST(processCurrenciesData(locale, localeData));
		}

		return generateDataModule(data, 'Object<Currency, CurrencyFormat>', [
			generateImport('Currency', 'i18n/numbers/types'),
			generateImport('CurrencyFormat', 'i18n/numbers/types')
		]);
	},

	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateFormats(locales) {
		const data = {};

		for (const [locale, localeData] of iterateCLDRData('cldr-numbers-modern', 'numbers.json', locales)) {
			data[locale] = convertJSONValueToAST(processNumbersData(locale, localeData));
		}

		return generateDataModule(data, 'Format', [
			generateImport('Format', 'i18n/numbers/types')
		]);
	}
};

module.exports = generator;
