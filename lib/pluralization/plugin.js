/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.pluralization.Plugin');
goog.require('zb.console');
goog.require('zb.i18n.Context');
goog.require('zb.i18n.IPlugin');
goog.require('zb.i18n.IPluginContext');
goog.require('zb.i18n.Locale');
goog.require('zb.i18n.pluralization.data.cardinals');
goog.require('zb.i18n.pluralization.data.forms');


/**
 * @implements {zb.i18n.IPlugin}
 */
zb.i18n.pluralization.Plugin = class {
	/**
	 */
	constructor() {
		/**
		 * @type {?zb.i18n.IPluginContext}
		 * @protected
		 */
		this._context = null;

		/**
		 * @type {string}
		 * @protected
		 */
		this._formsSeparator = zb.i18n.pluralization.Plugin.DEFAULT_FORMS_SEPARATOR;

		/**
		 * @type {string}
		 * @protected
		 */
		this._valueStub = zb.i18n.pluralization.Plugin.DEFAULT_VALUE_STUB;
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
		const language = this._extractLanguage(locale);
		return zb.i18n.pluralization.data.forms.hasOwnProperty(language) &&
			zb.i18n.pluralization.data.cardinals.hasOwnProperty(language);
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
	 * @param {zb.i18n.Locale} locale
	 * @param {string} rawValue
	 * @param {zb.i18n.Context} context
	 * @return {string}
	 */
	pluralize(locale, rawValue, context) {
		let value = rawValue;

		const PATTERN = zb.i18n.pluralization.Plugin.PATTERN;

		const pluralableRegex = new RegExp(PATTERN.replace('%key%', '(\\w+?)'), 'g');
		if (!pluralableRegex.test(value)) {
			return value;
		}

		const language = this._extractLanguage(locale);
		const languageForms = zb.i18n.pluralization.data.forms[language];
		const languageCardinals = zb.i18n.pluralization.data.cardinals[language];

		if (!languageCardinals) {
			zb.console.error(`Can't pluralize "${value}" with locale "${locale}"`);
			return value.replace(pluralableRegex, this._valueStub);
		}

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

				const resolvedForm = languageCardinals(count);
				const resolvedFormIndex = languageForms.indexOf(resolvedForm);

				matches.forEach((match) => {
					const formValues = match.replace(keyRegex, '$1')
						.split(this._formsSeparator, languageForms.length);

					value = value.replace(match, formValues[resolvedFormIndex] || this._valueStub);
				});
			});

		return value;
	}

	/**
	 * @param {zb.i18n.Locale} locale
	 * @return {string}
	 * @protected
	 */
	_extractLanguage(locale) {
		const localeParts = locale.match(/^\w+/);
		return localeParts ? localeParts[0] : locale;
	}
};


/**
 * @const {string}
 */
zb.i18n.pluralization.Plugin.PATTERN = '\\[%key%Plural:(.*?)\\]';


/**
 * @const {string}
 */
zb.i18n.pluralization.Plugin.DEFAULT_FORMS_SEPARATOR = '|';


/**
 * @const {string}
 */
zb.i18n.pluralization.Plugin.DEFAULT_VALUE_STUB = '???';
