const path = require('path');
const fs = require('fs');
const numbersGenerator = require('../generators/numbers');
const datetimeGenerator = require('../generators/datetime');
const plaralizationGenerator = require('../generators/pluralization');

const zbDeps = ['lib/vendor/base.js', 'console/interfaces/i-logger.js', 'console.js'];

/**
 * @param {Array<string>} locales
 */
function generateFixtures(locales) {
	const fixtures = {
		'pluralization-cardinals.js': plaralizationGenerator.generateCardinals(locales),
		'pluralization-forms.js': plaralizationGenerator.generateForms(locales),
		'numbers-currencies.js': numbersGenerator.generateCurrencies(locales),
		'numbers-formats.js': numbersGenerator.generateFormats(locales),
		'datetime-formats.js': datetimeGenerator.generateFormats(locales)
	};

	const fixturesPath = path.join(__dirname, 'fixtures');
	if (!fs.existsSync(fixturesPath)) {
		fs.mkdirSync(fixturesPath);
	} else {
		const files = fs.readdirSync(fixturesPath);
		files.forEach((fileName) => {
			fs.unlinkSync(path.join(fixturesPath, fileName));
		});
	}

	Object.keys(fixtures)
		.forEach((fileName) => {
			fs.writeFileSync(path.join(fixturesPath, fileName), fixtures[fileName], 'utf-8');
		});
}

/**
 * @return {Array<string>}
 */
function getAllAvailableLocales() {
	const cldrCorePath = path.dirname(require.resolve('cldr-core'));
	const data = JSON.parse(fs.readFileSync(path.join(cldrCorePath, 'availableLocales.json')));

	return data['availableLocales']['modern'];
}

generateFixtures(getAllAvailableLocales());

/**
 * @param {*} config
 */
module.exports = (config) => {
	config.set({
		// Base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// List of files/patterns to load in the browser
		files: [
			...zbDeps.map((file) => `../node_modules/zombiebox/zb/${file}`),
			'fixtures/*.js',
			'../lib/**/*.js',
			'lib/*.js'
		],

		// Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'closure',
			'mocha',
			'chai-sinon',
			'chai',
			'sinon'
		],

		// Available preprocessors: https://npmjs.com/browse/keyword/karma-preprocessor
		preprocessors: {
			'../node_modules/zombiebox/zb/**/*.js': ['closure'],
			'fixtures/*.js': ['closure'],
			'../lib/**/*.js': ['closure', 'coverage'],
			'lib/*.js': ['closure']
		},

		// Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			process.platform === 'darwin' ? 'ChromeCanaryHeadless' : 'ChromeHeadless'
		],

		// Available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'mocha',
			'coverage'
		],

		// Web server port
		port: 9876,

		// Level of logging
		logLevel: 'INFO',

		// Enable/disable colors in the output (reporters and logs)
		colors: true,

		// Enable/disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// If true, Karma captures browsers, runs the tests and exist
		singleRun: false,

		// How long will Karma wait for a message from a browser before disconnecting from it (in ms)
		browserNoActivityTimeout: 30000,

		// Client-specific options
		client: {
			captureConsole: true,
			mocha: {
				timeout: 10000
			}
		},

		// Istanbul code coverage tool's config
		coverageReporter: {
			type: 'html',
			dir: 'coverage'
		}
	});
};
