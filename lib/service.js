/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.Service');
goog.require('zb.i18n.plurals');



/**
 * @constructor
 */
zb.i18n.Service = function() {
	this._locale = null;
	this._packs = {};

	this._fallbackLocale = zb.i18n.Service.DEFAULT_FALLBACK_LOCALE;
	this._pluralFormsSeparator = zb.i18n.Service.DEFAULT_PLURAL_KEY_SEPARATOR;
	this._pluralValueStub = zb.i18n.Service.DEFAULT_PLURAL_VALUE_STUB;
};


/**
 * @param {string} locale
 */
zb.i18n.Service.prototype.setLocale = function(locale) {
	this._locale = locale;
};


/**
 * @param {string} locale
 */
zb.i18n.Service.prototype.setFallbackLocale = function(locale) {
	this._fallbackLocale = locale;
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
 * @param {string} locale
 * @param {zb.i18n.Pack} pack
 */
zb.i18n.Service.prototype.addPack = function(locale, pack) {
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
			locale = this._fallbackLocale;
			value = this._findValueInPacks(locale, key);
		}
	}

	if (!value) {
		return key;
	}

	if (opt_context) {
		value = this._interpolate(value, opt_context);
		value = this._pluralize(locale, value, opt_context);
	}

	return value;
};


/**
 * @param {string} locale
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
			value = value.replace(
				new RegExp(zb.i18n.Service.Pattern.INTERPOLATION.replace('%key%', key), 'g'),
				context[key]
			);
		});

	return value;
};


/**
 * @param {string} locale
 * @param {string} value
 * @param {zb.i18n.Service.Context} context
 * @return {string}
 * @protected
 */
zb.i18n.Service.prototype._pluralize = function(locale, value, context) {
	var pluralableRegex = new RegExp(zb.i18n.Service.Pattern.PLURALIZATION.replace('%key%', '(.+)'));
	if (!pluralableRegex.test(value)) {
		return value;
	}

	var localePlurals = zb.i18n.plurals.locales[locale];
	if (!localePlurals) {
		zb.console.error('Can\'t pluralize "' + value + '" with locale "' + locale + '"');
	}

	Object
		.keys(context)
		.forEach(function(key) {
			var keyRegex = new RegExp(zb.i18n.Service.Pattern.PLURALIZATION.replace('%key%', key), 'g');

			var count = parseFloat(('' + context[key]).replace(/[^\d[^.]+/g, ''));
			var matches = value.match(keyRegex);

			var localeCardinal = localePlurals && localePlurals.cardinal;
			var resolvedFormIndex = localeCardinal && localeCardinal.forms.indexOf(localeCardinal.resolver(count));

			matches.forEach(function(match) {
				if (!localeCardinal || isNaN(count)) {
					value = value.replace(match, this._pluralValueStub);
					return;
				}

				var formsValues = match
					.replace(keyRegex, '$1')
					.split(this._pluralFormsSeparator, localeCardinal.forms.length);

				value = value.replace(match, formsValues[resolvedFormIndex] || this._pluralValueStub);
			}, this);
		}, this);

	return value;
};


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
 * @typedef {!Object.<string, string>}
 */
zb.i18n.Service.Context;
