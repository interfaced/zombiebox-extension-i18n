/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Tokens follow Unicode CLDR format: http://cldr.unicode.org/translation/date-time
 * and http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 */
goog.provide('zb.i18n.datetime.Tokenizer');



/**
 * @param {zb.i18n.Service} service
 * @constructor
 */
zb.i18n.datetime.Tokenizer = function(service) {
	this._i18n = service;

	this._initTokens();
};


/**
 * @param {zb.i18n.datetime.Tokenizer.Token} token
 * @param {Date} date
 * @return {string}
 * @public
 */
zb.i18n.datetime.Tokenizer.prototype.format = function(token, date) {
	if (!this.tokens.hasOwnProperty(token)) {
		return '';
	}

	return this.tokens[token](date);
};


/**
 * Generates token functions
 * @protected
 */
zb.i18n.datetime.Tokenizer.prototype._initTokens = function() {
	// TODO: Z, z; Standalone months, days of week; quarters.
	this.tokens = {
		's': seconds,
		'ss': padded(seconds),
		'm': minutes,
		'mm': padded(minutes),
		'H': hours24,
		'HH': padded(hours24),
		'h': hours12,
		'hh': padded(hours12),
		'a': meridiemLower,
		'A': meridiem,
		'd': day,
		'dd': padded(day),
		'E': dayOfWeekAbbr,
		'EE': dayOfWeekAbbr,
		'EEE': dayOfWeekAbbr,
		'EEEE': dayOfWeekWide,
		'EEEEE': dayOfWeekNarrow,
		'M': month,
		'MM': padded(month),
		'MMM': monthNameAbbr,
		'MMMM': monthNameWide,
		'MMMMM': monthNameNarrow,
		'y': year,
		'yy': yearShort,
		'X': unixTime,
		'x': unixTimeMs,
		'z': unimplimented,
		'zz': unimplimented,
		'zzz': unimplimented,
		'zzzz': unimplimented
	};

	var i18n = this._i18n;

	function seconds(date) {
		return '' + date.getSeconds();
	}

	function minutes(date) {
		return '' + date.getMinutes();
	}

	function hours24(date) {
		return '' + date.getHours();
	}

	function hours12(date) {
		return '' + (date.getHours() % 12 || 12);
	}

	function meridiem(date) {
		var pm = date.getHours() >= 12;
		return pm ? i18n.trans('datetime.calendar.dayPeriods.pm') : i18n.trans('datetime.calendar.dayPeriods.am');
	}

	function meridiemLower(date) {
		return meridiem(date).toLowerCase();
	}

	function meridiemUpper(date) {
		return meridiem(date).toUpperCase();
	}

	function day(date) {
		return '' + date.getDate();
	}

	function dayOfWeekWide(date) {
		return i18n.trans('datetime.calendar.days.wide.' + date.getDay());
	}

	function dayOfWeekNarrow(date) {
		return i18n.trans('datetime.calendar.days.narrow.' + date.getDay());
	}

	function dayOfWeekAbbr(date) {
		return i18n.trans('datetime.calendar.days.abbreviated.' + date.getDay());
	}

	function month(date) {
		return '' + (date.getMonth() + 1);
	}

	function monthNameWide(date) {
		return i18n.trans('datetime.calendar.months.wide.' + date.getMonth());
	}

	function monthNameNarrow(date) {
		return i18n.trans('datetime.calendar.months.narrow.' + date.getMonth());
	}

	function monthNameAbbr(date) {
		return i18n.trans('datetime.calendar.months.abbreviated.' + date.getMonth());
	}

	function yearShort(date) {
		return '' + (date.getFullYear() % 100);
	}

	function year(date) {
		return '' + date.getFullYear();
	}

	function unixTime(date) {
		return '' + Math.floor(date.getTime() / 1000);
	}

	function unixTimeMs(date) {
		return '' + date.getTime();
	}

	function unimplimented() {
		return '';
	}

	/**
	 * @param {zb.i18n.datetime.Tokenizer.TokenFunction} original
	 * @return {zb.i18n.datetime.Tokenizer.TokenFunction}
	 */
	function padded(original) {
		return function(date) {
			var result = original.call(null, date);
			return ('00' + result).slice(-2);
		}
	}
};


/**
 * @type {!Object<zb.i18n.datetime.Tokenizer.Token, zb.i18n.datetime.Tokenizer.TokenFunction>}
 */
zb.i18n.datetime.Tokenizer.tokens;


/**
 * @type {zb.i18n.Service}
 * @protected
 */
zb.i18n.datetime.Tokenizer.prototype._i18n;


/**
 * @typedef {string}
 */
zb.i18n.datetime.Tokenizer.Token;


/**
 * @typedef {function(Date): string}
 */
zb.i18n.datetime.Tokenizer.TokenFunction;
