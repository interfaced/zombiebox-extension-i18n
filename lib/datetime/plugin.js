/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.datetime.Plugin');
goog.require('zb.console');
goog.require('zb.i18n.IPlugin');
goog.require('zb.i18n.IPluginContext');
goog.require('zb.i18n.Locale');
goog.require('zb.i18n.Pack');
goog.require('zb.i18n.datetime.Form');
goog.require('zb.i18n.datetime.Tokenizer');
goog.require('zb.i18n.datetime.data.formats');


/**
 * @implements {zb.i18n.IPlugin}
 */
zb.i18n.datetime.Plugin = class {
	/**
	 */
	constructor() {
		/**
		 * @type {zb.i18n.datetime.Tokenizer}
		 * @protected
		 */
		this._tokenizer = new zb.i18n.datetime.Tokenizer();

		/**
		 * @type {?zb.i18n.IPluginContext}
		 * @protected
		 */
		this._context = null;

		/**
		 * @type {RegExp}
		 * @protected
		 */
		this._formatRE;

		this._initFormatRE();
	}

	/**
	 * @override
	 */
	setContext(context) {
		this._context = context;
		this._tokenizer.setTranslator(context.transKey);
	}

	/**
	 * @override
	 */
	isLocaleSupported(locale) {
		return zb.i18n.datetime.data.formats.hasOwnProperty(locale);
	}

	/**
	 * @override
	 */
	useLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePack(locale);
		} else {
			zb.console.warn(`No date-time formats available for "${locale}"`);
		}
	}

	/**
	 * @override
	 */
	useFallbackLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePack(locale);
		} else {
			zb.console.warn(`No date-time formats available for fallback locale "${locale}"`);
		}
	}

	/**
	 * Formats arbitrary string. See zb.i18n.datetime.tokens for possible formatting tokens
	 * You probably should not use this as it ignores locale formats.
	 * Consider using methods such as getFullTime instead.
	 * Note that latin alphabetic characters are reserved for formatting tokens
	 * if you want to include such characters as they are, they should be escaped,
	 * see zb.i18n.datetime.Plugin.prototype._escapeString
	 * @param {Date} time
	 * @param {string} string
	 * @return {string}
	 */
	format(time, string) {
		const pieces = string.match(this._formatRE);
		if (!pieces) {
			return string;
		}

		const formatted = pieces.map((piece) => {
			if (this._tokenizer.tokens.hasOwnProperty(piece)) {
				return this._tokenizer.tokens[piece](time);
			}
			return this._unescapeString(piece);
		});

		return formatted.join('');
	}

	/**
	 * @param {Date} date
	 * @param {zb.i18n.datetime.Form} format
	 * @return {string}
	 */
	getTime(date, format) {
		return this.format(date, this._getFormatString('time', format));
	}

	/**
	 * @param {Date} date
	 * @param {zb.i18n.datetime.Form} format
	 * @return {string}
	 */
	getDate(date, format) {
		return this.format(date, this._getFormatString('date', format));
	}

	/**
	 * @param {Date} date
	 * @param {zb.i18n.datetime.Form} dateTimeForm
	 * @param {zb.i18n.datetime.Form} dateForm
	 * @param {zb.i18n.datetime.Form} timeForm
	 * @return {string}
	 */
	getDateTime(date, dateTimeForm, dateForm, timeForm) {
		const key = `datetime.dateTimeFormats.${dateTimeForm}`;

		if (!this._context.hasKey(key)) {
			return '';
		}

		const string = this._context.transKey(key, {
			date: this._getFormatString('date', dateForm),
			time: this._getFormatString('time', timeForm)
		});

		return this.format(date, string);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getFullTime(date) {
		return this.getTime(date, zb.i18n.datetime.Form.MEDIUM);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getShortTime(date) {
		return this.getTime(date, zb.i18n.datetime.Form.SHORT);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getFullDate(date) {
		return this.getDate(date, zb.i18n.datetime.Form.FULL);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getShortDate(date) {
		return this.getDate(date, zb.i18n.datetime.Form.SHORT);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getFullDateTime(date) {
		return this.getDateTime(
			date,
			zb.i18n.datetime.Form.FULL,
			zb.i18n.datetime.Form.FULL,
			zb.i18n.datetime.Form.MEDIUM
		);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getShortDateTime(date) {
		return this.getDateTime(
			date,
			zb.i18n.datetime.Form.SHORT,
			zb.i18n.datetime.Form.SHORT,
			zb.i18n.datetime.Form.SHORT
		);
	}

	/**
	 * @protected
	 */
	_initFormatRE() {
		const {ESCAPE_SYMBOL} = zb.i18n.datetime.Plugin;

		// Reverse sort ensures longer sequences of the same token appear first (i.e. MMMM before MM)
		// and thus get matched first among the options,
		// otherwise the string "MMMM" will get matched as two "MM" tokens.
		const tokens = Object.keys(this._tokenizer.tokens)
			.sort()
			.reverse()
			.join('|');

		const anything = '.+?';
		const escaped = `\\${ESCAPE_SYMBOL}${anything}\\${ESCAPE_SYMBOL}`;

		this._formatRE = new RegExp([escaped, tokens, anything].join('|'), 'g');
	}

	/**
	 * Escape symbol defined by zb.i18n.datetime.Plugin.ESCAPE_SYMBOL, single quote by default.
	 * Substrings enclosed into single quotes (') will be unquoted.
	 * To preserve a single quote symbol, escape it with a second single quote ('')
	 * Note: this is a simplistic implementation for the sake of efficiency and laziness,
	 * it will simply remove all occurrences of single quotes
	 * and replace double single quotes ('') with single single quote
	 * Example:	" foo 'bar' '' baz, ' quiz " => " foo bar ' baz,  quiz "
	 * @param {string} string
	 * @return {string}
	 * @protected
	 */
	_unescapeString(string) {
		const {ESCAPE_SYMBOL} = zb.i18n.datetime.Plugin;

		let pieces = string.split(ESCAPE_SYMBOL + ESCAPE_SYMBOL);
		pieces = pieces.map((piece) => piece.replace(new RegExp(ESCAPE_SYMBOL, 'g'), ''));

		return pieces.join(ESCAPE_SYMBOL);
	}

	/**
	 * @param {zb.i18n.Locale} locale
	 * @protected
	 */
	_addLocalePack(locale) {
		this._context.addPack(locale, new zb.i18n.Pack({
			'datetime': {
				'calendar': zb.i18n.datetime.data.formats[locale]['calendar'],
				'dateTimeFormats': zb.i18n.datetime.data.formats[locale]['formats']['dateTime']
			}
		}));
	}

	/**
	 * @param {string} type - either 'time' or 'date'
	 * @param {zb.i18n.datetime.Form} form
	 * @return {string}
	 * @protected
	 */
	_getFormatString(type, form) {
		const Formats = zb.i18n.datetime.data.formats;

		const locale = this._context.getLocale();
		const fallbackLocale = this._context.getFallbackLocale();

		if (locale && this.isLocaleSupported(locale)) {
			return Formats[locale]['formats'][type][form] || '';
		} else if (this.isLocaleSupported(fallbackLocale)) {
			return Formats[fallbackLocale]['formats'][type][form] || '';
		}

		return '';
	}
};


/**
 * As defined by unicode CLDR: http://cldr.unicode.org/translation/date-time#TOC-Symbols
 * @type {string}
 */
zb.i18n.datetime.Plugin.ESCAPE_SYMBOL = '\'';
