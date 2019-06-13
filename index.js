const path = require('path');
const {AbstractExtension} = require('zombiebox');
const datetimeGenerator = require('./generators/datetime');
const numbersGenerator = require('./generators/numbers');
const pluralizationGenerator = require('./generators/pluralization');


/**
 */
class Extension extends AbstractExtension {
	/**
	 * @override
	 */
	getName() {
		return 'i18n';
	}

	/**
	 * @override
	 */
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {
			extensions: {
				i18n: {
					locales: []
				}
			}
		};
	}

	/**
	 * @override
	 */
	generateCode(projectConfig) {
		const {locales} = projectConfig.extensions.i18n;

		return {
			'pluralization/cardinals.js': pluralizationGenerator.generateCardinals(locales),
			'pluralization/forms.js': pluralizationGenerator.generateForms(locales),
			'numbers/currencies.js': numbersGenerator.generateCurrencies(locales),
			'numbers/formats.js': numbersGenerator.generateFormats(locales),
			'datetime/formats.js': datetimeGenerator.generateFormats(locales),
			'datetime/relative.js': datetimeGenerator.generateRelativeFormats(locales)
		};
	}

	/**
	 * @override
	 */
	buildCLI(yargs, application) {
		return undefined;
	}
}


module.exports = Extension;
