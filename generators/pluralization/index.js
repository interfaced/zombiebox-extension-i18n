const fs = require('fs');
const path = require('path');
const jison = require('jison');
const {transpile} = require('./transpiler');
const {generateImport, generateDataModule, convertJSONValueToAST} = require('../utils');

const pluralsData = require('cldr-core/supplemental/plurals.json');
const cardinalData = pluralsData['supplemental']['plurals-type-cardinal'];

const parser = new jison.Parser(fs.readFileSync(path.resolve(__dirname, './grammar.jison'), 'utf8'));
const {ASTNode, CLDRRule} = require('../types');
const logger = require('../logger');


/**
 * @param {Object} data
 * @return {ASTNode}
 */
function parseAndTranspileForms(data) {
	const forms = {};

	Object.keys(data)
		.forEach((key) => {
			const form = key.substr('pluralRule-count-'.length);
			const rule = data[key];

			const parsedRule = /** @type {CLDRRule} */ parser.parse(rule);
			if (parsedRule) {
				forms[form] = parsedRule;
			}
		});

	return transpile(forms);
}

/**
 * @param {Object} data
 * @return {Array<string>}
 */
function extractForms(data) {
	return Object.keys(data).map((key) => key.substr('pluralRule-count-'.length));
}

const generator = {
	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateCardinals(locales) {
		const data = {};
		const languages = new Set(locales.map((locale) => locale.split('-')[0]));
		logger.verbose(`Generating cardinals for: ${Array.from(languages).join(', ')}`);

		for (const language of languages) {
			if (cardinalData[language] && language !== 'root') {
				data[language] = parseAndTranspileForms(cardinalData[language]);
			}
		}

		return generateDataModule(data, 'PluralizationFunction', [
			generateImport('PluralizationFunction', 'i18n/pluralization/types'),
			generateImport('isInIntegerRange', 'i18n/utils')
		]);
	},

	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateForms(locales) {
		const data = {};
		const languages = new Set(locales.map((locale) => locale.split('-')[0]));
		logger.verbose(`Generating pluralisation forms for: ${Array.from(languages).join(', ')}`);

		for (const language of languages) {
			if (cardinalData[language] && language !== 'root') {
				data[language] = convertJSONValueToAST(extractForms(cardinalData[language]));
			}
		}

		return generateDataModule(data, 'Array<Form>', [
			generateImport('Form', 'i18n/pluralization/types')
		]);
	}
};

module.exports = generator;
