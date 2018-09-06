const path = require('path');
const fs = require('fs');

const availableLocales = require('cldr-core/availableLocales.json')['availableLocales']['modern'];

const numbersGenerator = require('../generators/numbers');
const datetimeGenerator = require('../generators/datetime');
const pluralizationGenerator = require('../generators/pluralization');

const fixturesPath = path.join(__dirname, '..', 'test', 'fixtures');
const fixtures = {
	'pluralization-cardinals.js': pluralizationGenerator.generateCardinals(availableLocales),
	'pluralization-forms.js': pluralizationGenerator.generateForms(availableLocales),
	'numbers-currencies.js': numbersGenerator.generateCurrencies(availableLocales),
	'numbers-formats.js': numbersGenerator.generateFormats(availableLocales),
	'datetime-formats.js': datetimeGenerator.generateFormats(availableLocales),
	'datetime-relative.js': datetimeGenerator.generateRelativeFormats(availableLocales)
};

if (!fs.existsSync(fixturesPath)) {
	fs.mkdirSync(fixturesPath);
} else {
	fs.readdirSync(fixturesPath)
		.forEach((fileName) => {
			fs.unlinkSync(path.join(fixturesPath, fileName));
		});
}

Object.keys(fixtures)
	.forEach((fileName) => {
		fs.writeFileSync(path.join(fixturesPath, fileName), fixtures[fileName], 'utf-8');
	});

console.log(`Fixtures for ${availableLocales.length} locales have been generated`);
