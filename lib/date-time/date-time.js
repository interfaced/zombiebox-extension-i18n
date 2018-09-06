/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.DateTime');
goog.require('zb.i18n.Pack');
goog.require('zb.i18n.datetime.Formats');
goog.require('zb.i18n.datetime.Tokenizer');



/**
 * @param {zb.i18n.Service} i18n
 * @constructor
 */
zb.i18n.DateTime = function(i18n) {
	this.i18n = i18n;
	this._tokenizer = new zb.i18n.datetime.Tokenizer(i18n);

	this._initFormatRE();
};


/**
 * @param {zb.i18n.Locale} locale
 */
zb.i18n.DateTime.prototype.setLocale = function(locale) {
	this._locale = locale;

	if (this.isLocaleSupported(locale)) {
		this._addLocalePack(locale);
	} else {
		zb.console.warn('No date-time formats available for "' + locale, '"');
	}
};


/**
 * @param {zb.i18n.Locale} locale
 */
zb.i18n.DateTime.prototype.setFallbackLocale = function(locale) {
	this._fallbackLocale = locale;

	if (this.isLocaleSupported(locale)) {
		this._addLocalePack(locale);
	} else {
		zb.console.warn('No date-time formats available for fallback locale "' + locale + '"');
	}
};


/**
 * @return {zb.i18n.Locale}
 */
zb.i18n.DateTime.prototype.getLocale = function() {
	return this._locale;
};


/**
 * @param {zb.i18n.Locale} locale
 * @return {boolean}
 */
zb.i18n.DateTime.prototype.isLocaleSupported = function(locale) {
	return zb.i18n.datetime.Formats.hasOwnProperty(locale);
};


/**
 * Formats arbitrary string. See zb.i18n.datetime.tokens for possible formatting tokens
 * You probably should not use this as it ignores locale formats. Consider using methods such as getFullTime instead.
 * Note that latin alphabetic characters are reserved for formatting tokens
 * if you want to include such characters as they are, they should be escaped,
 * see zb.i18n.DateTime.prototype._escapeString
 * @param {Date} time
 * @param {string} string
 * @return {string}
 */
zb.i18n.DateTime.prototype.format = function(time, string) {
	var pieces = string.match(this._formatRE);
	if (!pieces) {
		return string;
	}

	var formatted = pieces.map(function(piece) {
		if (this._tokenizer.tokens.hasOwnProperty(piece)) {
			return this._tokenizer.tokens[piece](time);
		} else {
			return this._unescapeString(piece);
		}
	}, this);

	return formatted.join('');
};


/**
 * @param {Date} date
 * @param {zb.i18n.datetime.Form} format
 * @return {string}
 */
zb.i18n.DateTime.prototype.getTime = function(date, format) {
	return this.format(date, this._getFormatString('time', format));
};


/**
 * @param {Date} date
 * @param {zb.i18n.datetime.Form} format
 * @return {string}
 */
zb.i18n.DateTime.prototype.getDate = function(date, format) {
	return this.format(date, this._getFormatString('date', format));
};


/**
 * @param {Date} date
 * @param {zb.i18n.datetime.Form} dateTimeForm
 * @param {zb.i18n.datetime.Form} dateForm
 * @param {zb.i18n.datetime.Form} timeForm
 * @return {string}
 */
zb.i18n.DateTime.prototype.getDateTime = function(date, dateTimeForm, dateForm, timeForm) {
	var key = 'datetime.dateTimeFormats.' + dateTimeForm;

	if (!this.i18n.hasKey(key)) {
		return '';
	}

	var string = this.i18n.trans(key, {
		date: this._getFormatString('date', dateForm),
		time: this._getFormatString('time', timeForm)
	});

	return this.format(date, string);
};


/**
 * @param {Date} date
 * @return {string}
 */
zb.i18n.DateTime.prototype.getFullTime = function(date) {
	return this.getTime(date, zb.i18n.datetime.Form.MEDIUM);
};


/**
 * @param {Date} date
 * @return {string}
 */
zb.i18n.DateTime.prototype.getShortTime = function(date) {
	return this.getTime(date, zb.i18n.datetime.Form.SHORT);
};


/**
 * @param {Date} date
 * @return {string}
 */
zb.i18n.DateTime.prototype.getFullDate = function(date) {
	return this.getDate(date, zb.i18n.datetime.Form.FULL);
};


/**
 * @param {Date} date
 * @return {string}
 */
zb.i18n.DateTime.prototype.getShortDate = function(date) {
	return this.getDate(date, zb.i18n.datetime.Form.SHORT);
};


/**
 * @param {Date} date
 * @return {string}
 */
zb.i18n.DateTime.prototype.getFullDateTime = function(date) {
	return this.getDateTime(
		date,
		zb.i18n.datetime.Form.FULL,
		zb.i18n.datetime.Form.FULL,
		zb.i18n.datetime.Form.MEDIUM
	);
};


/**
 * @param {Date} date
 * @return {string}
 */
zb.i18n.DateTime.prototype.getShortDateTime = function(date) {
	return this.getDateTime(
		date,
		zb.i18n.datetime.Form.SHORT,
		zb.i18n.datetime.Form.SHORT,
		zb.i18n.datetime.Form.SHORT
	);
};


/**
 * @protected
 */
zb.i18n.DateTime.prototype._initFormatRE = function() {
	// Reverse sort ensures longer sequences of the same token appear first (i.e. MMMM before MM)
	// and thus get matched first among the options, otherwise the string "MMMM" will get matched as two "MM" tokens.
	var tokens = Object.keys(this._tokenizer.tokens).sort().reverse().join('|');
	var anything = '.+?';
	var escaped = '\\' + zb.i18n.DateTime.ESCAPE_SYMBOL + anything + '\\' + zb.i18n.DateTime.ESCAPE_SYMBOL;

	this._formatRE = new RegExp([escaped, tokens, anything].join('|'), 'g');
};


/**
 * Escape symbol defined by zb.i18n.DateTime.ESCAPE_SYMBOL, single quote by default.
 * Substrings enclosed into single quotes (') will be unquoted.
 * To preserve a single quote symbol, escape it with a second single quote ('')
 * Note: this is a simplistic implementation for the sake of efficiency and laziness,
 * it will simply remove all occurrences of single quotes and replace double single quotes ('') with single single quote
 * Example:	" foo 'bar' '' baz, ' quiz " => " foo bar ' baz,  quiz "
 * @param {string} string
 * @protected
 * @return {string}
 */
zb.i18n.DateTime.prototype._unescapeString = function(string) {
	var symbol = zb.i18n.DateTime.ESCAPE_SYMBOL;
	var escapedSymbol = zb.i18n.DateTime.ESCAPE_SYMBOL + zb.i18n.DateTime.ESCAPE_SYMBOL;

	var pieces = string.split(escapedSymbol);

	pieces = pieces.map(function(piece) {
		return piece.replace(new RegExp(symbol, 'g'), '');
	});

	return pieces.join(symbol);
};


/**
 * @param {zb.i18n.Locale} locale
 * @protected
 */
zb.i18n.DateTime.prototype._addLocalePack = function(locale) {
	this.i18n.addPack(locale, new zb.i18n.Pack({
		'datetime': {
			'calendar': zb.i18n.datetime.Formats[locale]['calendar'],
			'dateTimeFormats': zb.i18n.datetime.Formats[locale]['formats']['dateTime']
		}
	}));
};


/**
 * @param {string} type - either 'time' or 'date'
 * @param {zb.i18n.datetime.Form} form
 * @return {string}
 * @protected
 */
zb.i18n.DateTime.prototype._getFormatString = function(type, form) {
	var Formats = zb.i18n.datetime.Formats;

	if (this.isLocaleSupported(this._locale)) {
		return Formats[this._locale]['formats'][type][form] || '';
	} else if (this.isLocaleSupported(this._fallbackLocale)) {
		return Formats[this._fallbackLocale]['formats'][type][form] || '';
	} else {
		return '';
	}
};


/**
 * @type {RegExp}
 * @protected
 */
zb.i18n.DateTime.prototype._formatRE;



/**
 * @type {zb.i18n.datetime.Tokenizer}
 * @protected
 */
zb.i18n.DateTime.prototype._tokenizer;


/**
 * @enum {string}
 */
zb.i18n.datetime.Form = {
	SHORT: 'short',
	MEDIUM: 'medium',
	FULL: 'full',
	LONG: 'long'
};


/**
 * As defined by unicode CLDR: http://cldr.unicode.org/translation/date-time#TOC-Symbols
 * @type {string}
 */
zb.i18n.DateTime.ESCAPE_SYMBOL = '\'';
