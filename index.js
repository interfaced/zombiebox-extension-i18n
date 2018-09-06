const path = require('path');
const plaralizationGenerator = require('./generators/pluralization');
const numbersGenerator = require('./generators/numbers');
const datetimeGenerator = require('./generators/datetime');


/**
 * @implements {IZBAddon}
 */
class Extension {
	/**
	 * @return {string}
	 */
	getName() {
		return 'i18n';
	}

	/**
	 * @return {string}
	 */
	getPublicDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @return {Object}
	 */
	getConfig() {
		return {};
	}

	/**
	 * @param {ProjectConfig} projectConfig
	 * @return {Object<string, string>}
	 */
	generateCode(projectConfig) {
		const locales = projectConfig.getCustomValue('i18n.locales') || [];

		return {
			'pluralization-cardinals.js': plaralizationGenerator.generateCardinals(locales),
			'pluralization-forms.js': plaralizationGenerator.generateForms(locales),
			'numbers-currencies.js': numbersGenerator.generateCurrencies(locales),
			'numbers-formats.js': numbersGenerator.generateFormats(locales),
			'datetime-formats.js': datetimeGenerator.generateFormats(locales),
			'datetime-relative.js': datetimeGenerator.generateRelativeFormats(locales)
		};
	}
}


/**
 * @type {IZBAddon}
 */
module.exports = Extension;
