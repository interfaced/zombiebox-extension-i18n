/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import cardinalsData from 'generated/i18n/pluralization/cardinals';
import formsData from 'generated/i18n/pluralization/forms';
import {error} from 'zb/console/console';
import {reduceLocale} from '../utils';
import {Context, Locale} from '../types';
import IPlugin from '../interfaces/i-plugin';
import IPluginContext from '../interfaces/i-plugin-context';


/**
 * @implements {IPlugin}
 */
export default class Plugin {
	/**
	 */
	constructor() {
		/**
		 * @type {?IPluginContext}
		 * @protected
		 */
		this._context = null;

		/**
		 * @type {string}
		 * @protected
		 */
		this._formsSeparator = DEFAULT_FORMS_SEPARATOR;

		/**
		 * @type {string}
		 * @protected
		 */
		this._valueStub = DEFAULT_VALUE_STUB;
	}

	/**
	 * @override
	 */
	setContext(context) {
		this._context = context;
	}

	/**
	 * @override
	 */
	isLocaleSupported(locale) {
		const minimalFormsLocale = reduceLocale(
			locale,
			(locale) => formsData.hasOwnProperty(locale)
		);

		const minimalCardinalsLocale = reduceLocale(
			locale,
			(locale) => cardinalsData.hasOwnProperty(locale)
		);

		return !!(minimalFormsLocale && minimalCardinalsLocale);
	}

	/**
	 * @override
	 */
	useLocale(locale) {
		// Do nothing
	}

	/**
	 * @override
	 */
	useFallbackLocale(locale) {
		// Do nothing
	}

	/**
	 * @param {string} separator
	 */
	setFormsSeparator(separator) {
		this._formsSeparator = separator;
	}

	/**
	 * @param {string} stub
	 */
	setValueStub(stub) {
		this._valueStub = stub;
	}

	/**
	 * TODO: precompile RegExps
	 * @param {Locale} locale
	 * @param {string} rawValue
	 * @param {Context} context
	 * @return {string}
	 */
	pluralize(locale, rawValue, context) {
		let value = rawValue;

		const pluralableRegex = new RegExp(PATTERN.replace('%key%', '(\\w+?)'), 'g');
		if (!pluralableRegex.test(value)) {
			return value;
		}

		const minimalLocale = reduceLocale(
			locale,
			(locale) => formsData.hasOwnProperty(locale)
		);

		if (
			!minimalLocale ||
			!formsData.hasOwnProperty(minimalLocale) ||
			!cardinalsData.hasOwnProperty(minimalLocale)
		) {
			error(`Can't pluralize "${value}" with locale "${locale}"`);
			return value.replace(pluralableRegex, this._valueStub);
		}

		const localeForms = formsData[minimalLocale];
		const localeCardinals = cardinalsData[minimalLocale];

		Object.keys(context)
			.forEach((key) => {
				const count = context[key];
				const keyRegex = new RegExp(PATTERN.replace('%key%', key), 'g');

				if (typeof count !== 'number') {
					value = value.replace(keyRegex, this._valueStub);
					return;
				}

				const matches = value.match(keyRegex);
				if (!matches) {
					return;
				}

				const resolvedForm = localeCardinals(count);
				const resolvedFormIndex = localeForms.indexOf(resolvedForm);

				matches.forEach((match) => {
					const formValues = match.replace(keyRegex, '$1')
						.split(this._formsSeparator, localeForms.length);

					value = value.replace(match, formValues[resolvedFormIndex] || this._valueStub);
				});
			});

		return value;
	}
}


/**
 * @const {string}
 */
export const PATTERN = '\\[%key%Plural:(.*?)\\]';


/**
 * @const {string}
 */
export const DEFAULT_FORMS_SEPARATOR = '|';


/**
 * @const {string}
 */
export const DEFAULT_VALUE_STUB = '???';
