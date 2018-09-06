/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.Service');
goog.require('zb.i18n.DateTime');
goog.require('zb.i18n.Numbers');
goog.require('zb.i18n.plurals');



/**
 * @constructor
 */
zb.i18n.Service = function() {
	this._locale = null;
	this._packs = {};
	this.time = new zb.i18n.DateTime(this);
	this.numbers = new zb.i18n.Numbers(this);

	this._fallbackLocale = zb.i18n.Service.DEFAULT_FALLBACK_LOCALE;
	this._pluralFormsSeparator = zb.i18n.Service.DEFAULT_PLURAL_KEY_SEPARATOR;
	this._pluralValueStub = zb.i18n.Service.DEFAULT_PLURAL_VALUE_STUB;
};


/**
 * @param {zb.i18n.Locale} locale
 */
zb.i18n.Service.prototype.setLocale = function(locale) {
	locale = this._normalizeLocale(locale);
	this._locale = locale;
	this.time.setLocale(locale);
	this.numbers.setLocale(locale);
};


/**
 * @return {?zb.i18n.Locale} locale
 */
zb.i18n.Service.prototype.getLocale = function() {
	return this._locale;
};


/**
 * @param {zb.i18n.Locale} locale
 */
zb.i18n.Service.prototype.setFallbackLocale = function(locale) {
	locale = this._normalizeLocale(locale);
	this._fallbackLocale = locale;
	this.time.setFallbackLocale(locale);
	this.numbers.setFallbackLocale(locale);
};


/**
 * @return {?zb.i18n.Locale}
 */
zb.i18n.Service.prototype.getFallbackLocale = function() {
	return this._fallbackLocale;
};


/**
 * @param {string} separator
 */
zb.i18n.Service.prototype.setPluralFormsSeparator = function(separator) {
	this._pluralFormsSeparator = separator;
};


/**
 * @param {string} stub
 */
zb.i18n.Service.prototype.setPluralValueStub = function(stub) {
	this._pluralValueStub = stub;
};


/**
 * @param {zb.i18n.Locale} locale
 * @param {zb.i18n.Pack} pack
 */
zb.i18n.Service.prototype.addPack = function(locale, pack) {
	locale = this._normalizeLocale(locale);

	if (!this._packs[locale]) {
		this._packs[locale] = [];
	}

	if (this._packs[locale].indexOf(pack) !== -1) {
		throw new Error('Already added pack cannot be added again');
	}

	this._packs[locale].unshift(pack);
};


/**
 * @param {string} key
 * @param {zb.i18n.Locale=} opt_locale
 * @return {boolean}
 */
zb.i18n.Service.prototype.hasKey = function(key, opt_locale) {
	return this._findValueInPacks(opt_locale || this._locale || this._fallbackLocale, key) !== null;
};


/**
 * @param {string} key
 * @param {zb.i18n.Service.Context=} opt_context
 * @return {string}
 */
zb.i18n.Service.prototype.trans = function(key, opt_context) {
	var locale, value;

	if (!this._locale) {
		locale = this._fallbackLocale;
		value = this._findValueInPacks(locale, key);
	} else {
		locale = /** @type {string} */ (this._locale);
		value = this._findValueInPacks(locale, key);

		if (!value) {
			zb.console.warn('No translation found for key "' + key + '" in locale "' + locale + '". ' +
			                'Falling back to "' + this._fallbackLocale + '"');
			locale = this._fallbackLocale;
			value = this._findValueInPacks(locale, key);
		}
	}

	if (!value) {
		zb.console.warn('No translation found for key "' + key + '" in locale "' + locale + '"');
		return key;
	}

	if (opt_context) {
		value = this._interpolate(value, opt_context);
		value = this._pluralize(locale, value, opt_context);
	}

	return value;
};


/**
 * @param {zb.i18n.Locale} locale
 * @return {boolean}
 */
zb.i18n.Service.prototype.isLocaleSupported = function(locale) {
	var hasPluralizationRules = zb.i18n.plurals.languages.hasOwnProperty(this._extractLanguage(locale));
	var hasDateTimeFormats = this.time.isLocaleSupported(locale);

	return hasPluralizationRules && hasDateTimeFormats;
};


/**
 * Attempts to normalize invalid or inconvenient locales.
 * @param {string} locale
 * @return {zb.i18n.Locale}
 * @private
 */
zb.i18n.Service.prototype._normalizeLocale = function(locale) {
	locale = locale.replace('_', '-');

	var parts = locale.split('-');
	var possibleLocales = [];
	parts.reduce(function(accumulated, current) {
		possibleLocales.push(accumulated);
		return accumulated + '-' + current;
	});
	possibleLocales.push(locale);
	possibleLocales.reverse();

	for (var i = 0; i < possibleLocales.length; i++) {
		if (this.isLocaleSupported(possibleLocales[i])) {
			return possibleLocales[i];
		}
	}

	return locale;
};


/**
 * @param {zb.i18n.Locale} locale
 * @return {string}
 * @protected
 */
zb.i18n.Service.prototype._extractLanguage = function(locale) {
	var localeParts = locale.match(/^\w+/);
	return localeParts ? localeParts[0] : locale;
};


/**
 * @param {zb.i18n.Locale} locale
 * @param {string} key
 * @return {?string}
 * @protected
 */
zb.i18n.Service.prototype._findValueInPacks = function(locale, key) {
	var foundValue = null;
	(this._packs[locale] || []).forEach(function(pack) {
		if (foundValue) {
			return;
		}

		foundValue = pack.getValue(key);
	});

	return foundValue;
};


/**
 * @param {string} value
 * @param {zb.i18n.Service.Context} context
 * @return {string}
 * @protected
 */
zb.i18n.Service.prototype._interpolate = function(value, context) {
	Object
		.keys(context)
		.forEach(function(key) {
			var keyValue = context[key];

			if (typeof keyValue === 'number') {
				keyValue = this.numbers.formatNumber(keyValue);
			}

			value = value.replace(
				new RegExp(zb.i18n.Service.Pattern.INTERPOLATION.replace('%key%', key), 'g'),
				keyValue
			);
		}, this);

	return value;
};


/**
 * TODO: precompile RegExps
 * @param {zb.i18n.Locale} locale
 * @param {string} value
 * @param {zb.i18n.Service.Context} context
 * @return {string}
 * @protected
 */
zb.i18n.Service.prototype._pluralize = function(locale, value, context) {
	var pluralableRegex = new RegExp(zb.i18n.Service.Pattern.PLURALIZATION.replace('%key%', '(\\w+?)'), 'g');
	if (!pluralableRegex.test(value)) {
		return value;
	}

	var language = this._extractLanguage(locale);
	var languagePlurals = zb.i18n.plurals.languages[language];

	if (!languagePlurals) {
		zb.console.error('Can\'t pluralize "' + value + '" with locale "' + locale + '"');
		return value.replace(pluralableRegex, this._pluralValueStub);
	}

	Object
		.keys(context)
		.forEach(function(key) {
			var count = context[key];
			var keyRegex = new RegExp(zb.i18n.Service.Pattern.PLURALIZATION.replace('%key%', key), 'g');

			if (typeof count !== 'number') {
				value = value.replace(keyRegex, this._pluralValueStub);
				return;
			}

			var matches = value.match(keyRegex);
			if (!matches) {
				return;
			}

			var languageCardinal = languagePlurals && languagePlurals.cardinal;
			var resolvedFormIndex = languageCardinal && languageCardinal.forms.indexOf(languageCardinal.resolver(count));

			matches.forEach(function(match) {
				if (!languageCardinal || isNaN(count)) {
					value = value.replace(match, this._pluralValueStub);
					return;
				}

				var formsValues = match
					.replace(keyRegex, '$1')
					.split(this._pluralFormsSeparator, languageCardinal.forms.length);

				value = value.replace(match, formsValues[resolvedFormIndex] || this._pluralValueStub);
			}, this);
		}, this);

	return value;
};


/**
 * @type {zb.i18n.DateTime}
 * @public
 */
zb.i18n.Service.prototype.time;


/**
 * @type {zb.i18n.Numbers}
 * @public
 */
zb.i18n.Service.prototype.numbers;


/**
 * @type {?string}
 * @protected
 */
zb.i18n.Service.prototype._locale;


/**
 * @type {string}
 * @protected
 */
zb.i18n.Service.prototype._fallbackLocale;


/**
 * @type {string}
 * @protected
 */
zb.i18n.Service.prototype._pluralFormsSeparator;


/**
 * @type {string}
 * @protected
 */
zb.i18n.Service.prototype._pluralValueStub;


/**
 * @type {Object.<string, Array.<zb.i18n.Pack>>}
 * @protected
 */
zb.i18n.Service.prototype._packs;


/**
 * @const {string}
 */
zb.i18n.Service.DEFAULT_FALLBACK_LOCALE = 'en';


/**
 * @const {string}
 */
zb.i18n.Service.DEFAULT_PLURAL_KEY_SEPARATOR = '|';


/**
 * @const {string}
 */
zb.i18n.Service.DEFAULT_PLURAL_VALUE_STUB = '???';


/**
 * @enum {string}
 */
zb.i18n.Service.Pattern = {
	INTERPOLATION: '\\[%key%\\]',
	PLURALIZATION: '\\[%key%Plural:(.*?)\\]'
};


/**
 * @typedef {!Object.<string, string|number>}
 */
zb.i18n.Service.Context;


/**
 * @typedef {string}
 * As defined in BCP 47: https://tools.ietf.org/html/bcp47
 */
zb.i18n.Locale;
