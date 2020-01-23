/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Tokens follow Unicode CLDR format: http://cldr.unicode.org/translation/date-time
// and http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table

import {Context} from '../types';


/**
 */
export default class Tokenizer {
	/**
	 */
	constructor() {
		const identity = (key) => key;

		/**
		 * @type {!Object<Token, TokenFunction>}
		 */
		this.tokens;

		/**
		 * @type {Translator}
		 * @protected
		 */
		this._translator = identity;

		this._initTokens();
	}

	/**
	 * @param {Translator} translator
	 */
	setTranslator(translator) {
		this._translator = translator;
	}

	/**
	 * @param {Token} token
	 * @param {Date} date
	 * @return {string}
	 */
	format(token, date) {
		if (!this.tokens.hasOwnProperty(token)) {
			return '';
		}

		return this.tokens[token](date);
	}

	/**
	 * Generates token functions
	 * @protected
	 */
	_initTokens() {
		/**
		 * @param {TokenFunction} original
		 * @return {TokenFunction}
		 */
		const padded = (original) => (date) => (`00${original.call(null, date)}`).slice(-2);

		const unimplimented = () => '';

		const seconds = (date) => date.getSeconds().toString();

		const minutes = (date) => date.getMinutes().toString();

		const hours24 = (date) => date.getHours().toString();

		const hours12 = (date) => (date.getHours() % 12 || 12).toString();

		const meridiem = (date) => {
			const pm = date.getHours() >= 12;
			return pm ?
				this._translator('datetime.calendar.dayPeriods.pm') :
				this._translator('datetime.calendar.dayPeriods.am');
		};

		const meridiemLower = (date) => meridiem(date).toLowerCase();

		// eslint-disable-next-line no-unused-vars
		const meridiemUpper = (date) => meridiem(date).toUpperCase();

		const day = (date) => date.getDate().toString();

		const dayOfWeekWide = (date) => this._translator(`datetime.calendar.days.wide.${date.getDay()}`);

		const dayOfWeekNarrow = (date) => this._translator(`datetime.calendar.days.narrow.${date.getDay()}`);

		const dayOfWeekAbbr = (date) => this._translator(`datetime.calendar.days.abbreviated.${date.getDay()}`);

		const month = (date) => (date.getMonth() + 1).toString();

		const monthNameWide = (date) => this._translator(`datetime.calendar.months.wide.${date.getMonth()}`);

		const monthNameNarrow = (date) => this._translator(`datetime.calendar.months.narrow.${date.getMonth()}`);

		const monthNameAbbr = (date) => this._translator(`datetime.calendar.months.abbreviated.${date.getMonth()}`);

		const yearShort = (date) => (date.getFullYear() % 100).toString();

		const year = (date) => date.getFullYear().toString();

		const unixTime = (date) => (Math.floor(date.getTime() / 1000)).toString();

		const unixTimeMs = (date) => date.getTime().toString();

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
	}
}


/**
 * @typedef {function(string, Context=): string}
 */
let Translator;


/**
 * @typedef {string}
 */
let Token;


/**
 * @typedef {function(Date): string}
 */
let TokenFunction;
