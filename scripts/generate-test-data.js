const path = require('path');
const fse = require('fs-extra');

const availableLocales = require('cldr-core/availableLocales.json')['availableLocales']['modern'];

const numbersGenerator = require('../generators/numbers');
const datetimeGenerator = require('../generators/datetime');
const pluralizationGenerator = require('../generators/pluralization');

const basePath = path.join(__dirname, '..', 'test', 'generated', 'i18n');
const files = {
	'pluralization/cardinals.js': pluralizationGenerator.generateCardinals(availableLocales),
	'pluralization/forms.js': pluralizationGenerator.generateForms(availableLocales),
	'numbers/currencies.js': numbersGenerator.generateCurrencies(availableLocales),
	'numbers/formats.js': numbersGenerator.generateFormats(availableLocales),
	'datetime/formats.js': datetimeGenerator.generateFormats(availableLocales),
	'datetime/relative.js': datetimeGenerator.generateRelativeFormats(availableLocales)
};

fse.ensureDir(basePath)
	.then(() => fse.emptyDir(basePath))
	.then(() => Promise.all(Object.keys(files).map(
		(fileName) => fse.outputFile(path.join(basePath, fileName), files[fileName], 'utf-8')
	)))
	.then(() => console.log(`Data for ${availableLocales.length} locales have been generated`));
