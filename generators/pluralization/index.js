const fs = require('fs');
const path = require('path');
const jison = require('jison');
const {transpile} = require('./transpiler');
const {generateDataModule, convertJSONValueToAST} = require('../utils');

const pluralsData = require('cldr-core/supplemental/plurals.json');
const cardinalData = pluralsData['supplemental']['plurals-type-cardinal'];

const parser = new jison.Parser(fs.readFileSync(path.resolve(__dirname, './grammar.jison'), 'utf8'));

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

		for (const locale of locales) {
			if (cardinalData[locale] && locale !== 'root') {
				data[locale] = parseAndTranspileForms(cardinalData[locale]);
			}
		}

		return generateDataModule(
			'zb.i18n.pluralization.data.cardinals',
			['zb.i18n.pluralization.PluralizationFunction', 'zb.i18n.utils'],
			'zb.i18n.pluralization.PluralizationFunction',
			data
		);
	},

	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateForms(locales) {
		const data = {};

		for (const locale of locales) {
			if (cardinalData[locale] && locale !== 'root') {
				data[locale] = convertJSONValueToAST(extractForms(cardinalData[locale]));
			}
		}

		return generateDataModule(
			'zb.i18n.pluralization.data.forms',
			['zb.i18n.pluralization.Form'],
			'Array<zb.i18n.pluralization.Form>',
			data
		);
	}
};

module.exports = generator;
