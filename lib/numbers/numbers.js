/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.Numbers');
goog.require('zb.i18n.Pack');
goog.require('zb.i18n.numbers.currencies');
goog.require('zb.i18n.numbers.Formats');



/**
 * @param {zb.i18n.Service} i18n
 * @constructor
 */
zb.i18n.Numbers = function(i18n) {
	this._i18n = i18n;
};


/**
 * @param {number} value
 * @param {number=} opt_precision
 * @return {string}
 */
zb.i18n.Numbers.prototype.formatNumber = function(value, opt_precision) {
	var result;
	var isInteger = value === parseInt(value, 10);
	var integerString = '' + Math.floor(value);

	var groupingRequired = integerString.length > 3;

	if (groupingRequired) {
		var groupSeparator = this._i18n.hasKey('numbers.formats.delimiters.group', this._locale) ?
			this._i18n.trans('numbers.formats.delimiters.group') : this.DEFAULT_GROUP_SEPARATOR;

		// Separate string into groups of three digits (thousands) starting from right ('10000000' -> '10 000 000')
		// TODO: Some numbering conventions may separate numbers differently, for example Indian (1,00,00,000.0001)
		integerString = integerString.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
	}

	result = integerString;

	var fractionalPartRequired = isInteger && opt_precision > 0 || !isInteger && opt_precision !== 0;

	if (fractionalPartRequired) {
		var decimalSeparator = this._i18n.hasKey('numbers.formats.delimiters.decimal', this._locale) ?
			this._i18n.trans('numbers.formats.delimiters.decimal') : this.DEFAULT_DECIMAL_SEPARATOR;
		var fractionString;

		if (opt_precision === undefined) {
			fractionString = value.toString();
		} else {
			fractionString = value.toFixed(opt_precision);
		}

		fractionString = fractionString.split('.')[1];
		result += decimalSeparator + fractionString;
	}

	return result;
};


/**
 * @param {number} value
 * @param {zb.i18n.numbers.Currency} currency
 * @param {boolean=} opt_fractional
 * @param {zb.i18n.numbers.CurrencySymbolType=} opt_symbolType
 * @return {string}
 */
zb.i18n.Numbers.prototype.formatCurrency = function(value, currency, opt_fractional, opt_symbolType) {
	var precision = opt_fractional ? 2 : 0;
	var symbolType = opt_symbolType || zb.i18n.numbers.CurrencySymbolType.NARROW;

	var isNarrow = symbolType === zb.i18n.numbers.CurrencySymbolType.NARROW;

	var i18n = this._i18n;
	function get(symbolType, locale) {
		var keyString = 'numbers.currencies.' + currency + '.' + symbolType;
		return i18n.hasKey(keyString) ? i18n.trans(keyString) : null;
	}

	var symbol = null ||
		isNarrow && get('narrowSymbol', this._locale) ||
		            get('symbol', this._locale) ||
		isNarrow && get('narrowSymbol', this._fallbackLocale) ||
		            get('symbol', this._fallbackLocale) ||
		currency;

	return this._i18n.trans('numbers.formats.currency', {
		value: this.formatNumber(value, precision),
		symbol: symbol
	});
};


/**
 * @param {zb.i18n.Locale} locale
 * @return {boolean}
 */
zb.i18n.Numbers.prototype.isLocaleSupported = function(locale) {
	return zb.i18n.numbers.Formats.hasOwnProperty(locale);
};


/**
 * @param {zb.i18n.Locale} locale
 */
zb.i18n.Numbers.prototype.setLocale = function(locale) {
	this._locale = locale;

	if (this.isLocaleSupported(locale)) {
		this._addLocalePack(locale);
	} else {
		zb.console.warn('No numbers formats available for "' + locale, '"');
	}
};


/**
 * @param {zb.i18n.Locale} locale
 */
zb.i18n.Numbers.prototype.setFallbackLocale = function(locale) {
	this._fallbackLocale = locale;

	if (this.isLocaleSupported(locale)) {
		this._addLocalePack(locale);
	} else {
		zb.console.warn('No numbers formats available for fallback locale "' + locale + '"');
	}
};


/**
 * @param {zb.i18n.Locale} locale
 * @protected
 */
zb.i18n.Numbers.prototype._addLocalePack = function(locale) {
	this._i18n.addPack(locale, new zb.i18n.Pack({
		'numbers': {
			'formats': zb.i18n.numbers.Formats[locale],
			'currencies': zb.i18n.numbers.currencies[locale]
		}
	}));
};



/**
 * @type {zb.i18n.Service}
 * @protected
 */
zb.i18n.Numbers.prototype._i18n;


/**
 * @const {string}
 */
zb.i18n.Numbers.prototype.DEFAULT_DECIMAL_SEPARATOR = '.';


/**
 * @const {string}
 */
zb.i18n.Numbers.prototype.DEFAULT_GROUP_SEPARATOR = '';


/**
 * @enum {string}
 */
zb.i18n.numbers.CurrencySymbolType = {
	NARROW: 'narrow',
	FULL: 'FULL'
};


/**
 * @typedef {string}
 */
zb.i18n.numbers.Currency;
