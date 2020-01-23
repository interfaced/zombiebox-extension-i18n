/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import formatsData from 'generated/i18n/datetime/formats';
import relativeFormatsData from 'generated/i18n/datetime/relative';
import {warn} from 'zb/console/console';
import {isoWeekNumber, reduceLocale} from '../utils';
import IPlugin from '../interfaces/i-plugin';
import IPluginContext from '../interfaces/i-plugin-context';
import Pack from '../pack';
import {Locale} from '../types';
import {Form, RelativeTimeOptions, Unit, RELATIVE_TIME_SHIFT_VALUES} from './types';
import Tokenizer from './tokenizer';


/**
 * @implements {IPlugin}
 */
export default class Plugin {
	/**
	 */
	constructor() {
		/**
		 * @type {Tokenizer}
		 * @protected
		 */
		this._tokenizer = new Tokenizer();

		/**
		 * @type {?IPluginContext}
		 * @protected
		 */
		this._context = null;

		/**
		 * @type {RegExp}
		 * @protected
		 */
		this._formatRE;

		/**
		 * Each predicate returns whether the date is the same (shift = 0) unit as now or not
		 * with shift = 1 it returns if the date is the next calendar entity of the same unit or not
		 * @type {Object<Unit, function(Date, Date, number): boolean>}
		 * @protected
		 */
		this._isWithin;

		this._initFormatRE();
		this._initCalendarPredicates();
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
		const minimalDateLocale = reduceLocale(
			locale,
			(locale) => formatsData.hasOwnProperty(locale)
		);

		const minimalRelativeLocale = reduceLocale(
			locale,
			(locale) => relativeFormatsData.hasOwnProperty(locale)
		);

		return !!(minimalDateLocale && minimalRelativeLocale);
	}

	/**
	 * @override
	 */
	useLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePacks(locale);
		} else {
			warn(`No date-time formats available for "${locale}"`);
		}
	}

	/**
	 * @override
	 */
	useFallbackLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePacks(locale);
		} else {
			warn(`No date-time formats available for fallback locale "${locale}"`);
		}
	}

	/**
	 * Formats arbitrary string.
	 * You probably should not use this as it ignores locale formats.
	 * Consider using methods such as getFullTime instead.
	 * Note that latin alphabetic characters are reserved for formatting tokens
	 * if you want to include such characters as they are, they should be escaped,
	 * see Plugin.prototype._escapeString
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
	 * @param {Form} format
	 * @return {string}
	 */
	getTime(date, format) {
		return this.format(date, this._getFormatString('time', format));
	}

	/**
	 * @param {Date} date
	 * @param {Form} format
	 * @return {string}
	 */
	getDate(date, format) {
		return this.format(date, this._getFormatString('date', format));
	}

	/**
	 * @param {Date} date
	 * @param {Form} dateTimeForm
	 * @param {Form} dateForm
	 * @param {Form} timeForm
	 * @return {string}
	 */
	getDateTime(date, dateTimeForm, dateForm, timeForm) {
		const key = `datetime.dateTimeFormats.${dateTimeForm}`;

		if (!this._context.hasKey(key)) {
			return '';
		}

		const string = this._context.transKey(key, {
			'date': this._getFormatString('date', dateForm),
			'time': this._getFormatString('time', timeForm)
		});

		return this.format(date, string);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getFullTime(date) {
		return this.getTime(date, Form.MEDIUM);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getShortTime(date) {
		return this.getTime(date, Form.SHORT);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getFullDate(date) {
		return this.getDate(date, Form.FULL);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getShortDate(date) {
		return this.getDate(date, Form.SHORT);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getFullDateTime(date) {
		return this.getDateTime(
			date,
			Form.FULL,
			Form.FULL,
			Form.MEDIUM
		);
	}

	/**
	 * @param {Date} date
	 * @return {string}
	 */
	getShortDateTime(date) {
		return this.getDateTime(
			date,
			Form.SHORT,
			Form.SHORT,
			Form.SHORT
		);
	}

	/**
	 * @param {Date} date
	 * @param {Date} now
	 * @param {RelativeTimeOptions} options
	 * @return {string}
	 */
	relative(date, now = new Date(), options = {}) {
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = Unit;
		const allUnitsDesc = [YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND];

		const desiredUnits = allUnitsDesc.slice(
			allUnitsDesc.indexOf(options.maxUnit || YEAR),
			allUnitsDesc.indexOf(options.minUnit || SECOND) + 1
		);

		if (!desiredUnits.length) {
			throw new Error(`Invalid configuration: ` +
				`Cannot select a unit with minUnit: ${options.minUnit} and maxUnit: ${options.maxUnit}`);
		}

		const diff = this._calendarDiff(date, now, desiredUnits);
		const unit = this._selectRelativeUnit(diff, desiredUnits);

		if (options.useAdverbs || typeof options.useAdverbs === 'undefined') {
			const adverb = this._selectAdverb(date, now, [unit]);

			if (adverb) {
				return adverb;
			}
		}

		const tense = date.getTime() - now.getTime() > 0 ? 'future' : 'past';
		const value = diff[unit];

		return this._context.transKey(`relative.${unit}.${tense}`, {
			'value': value
		});
	}

	/**
	 * @param {Date} date
	 * @param {Date} now
	 * @param {!Array<Unit>} units
	 * @return {?string}
	 * @protected
	 */
	_selectAdverb(date, now, units) {
		for (const unit of units) {
			for (const shift of RELATIVE_TIME_SHIFT_VALUES) {
				const key = `relative.${unit}.adverbs.${shift.toFixed()}`;

				if (this._isWithin[unit](date, now, shift) && this._context.hasKey(key)) {
					return this._context.transKey(key);
				}
			}
		}

		return null;
	}

	/**
	 * @param {Object<Unit, number>} diff
	 * @param {Array<Unit>} candidateUnits
	 * @return {Unit}
	 * @protected
	 */
	_selectRelativeUnit(diff, candidateUnits) {
		return candidateUnits.find((unit) => diff[unit] > 0) || candidateUnits[candidateUnits.length - 1];
	}

	/**
	 * @param {Date} a
	 * @param {Date} b
	 * @param {Array<Unit>} units
	 * @return {Object<Unit, number>}
	 * @protected
	 */
	_calendarDiff(a, b, units) {
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = Unit;

		const incYear = (date, step = 1) => date.setYear(date.getFullYear() + step);
		const incMonth = (date, step = 1) => date.setMonth(date.getMonth() + step);
		const incDate = (date, step = 1) => date.setDate(date.getDate() + step);

		const [former, latter] = a < b ? [a, b] : [b, a];

		const diff = {
			[YEAR]: 0,
			[MONTH]: 0,
			[WEEK]: 0,
			[DAY]: 0,
			[HOUR]: 0,
			[MINUTE]: 0,
			[SECOND]: 0
		};

		// Starting with the first date (`former`) we advance `accumulated` further by adding each unit one at a time
		// `tmpDate` contains next value on each step which might or might not advance past
		// the the second date (`latter`). If it does not, we increase `accumulated` by that value,
		// if it does – we move on to next unit.
		// Example:
		// `former` is May 15th 2047
		// `later` is January 7th 2049
		// `accumulated` starts as `former` (May 15th 2047)
		// `tmpDate` advances by 1 year to May 15th 2048,
		// since it's still before `latter`, we add one year to `accumulated` and to `diff[YEAR]`.
		// Next additional year however puts `tmpDate` to May 15th 2049 which is beyond `later`,
		// so we're done with years and move on to months with `accumulated` now being May 15th 2048.
		const accumulated = new Date(former);
		let tmpDate;

		if (units.includes(YEAR)) {
			tmpDate = new Date(accumulated);
			while (incYear(tmpDate) <= latter) {
				diff[YEAR]++;
			}
			incYear(accumulated, diff[YEAR]);
		}

		if (units.includes(MONTH)) {
			tmpDate = new Date(accumulated);
			while (incMonth(tmpDate) <= latter) {
				diff[MONTH]++;
			}
			incMonth(accumulated, diff[MONTH]);
		}

		if (units.includes(WEEK)) {
			tmpDate = new Date(accumulated);
			while (incDate(tmpDate, 7) <= latter) {
				diff[WEEK]++;
			}
			incDate(accumulated, diff[WEEK] * 7);
		}

		if (units.includes(DAY)) {
			tmpDate = new Date(accumulated);
			while (incDate(tmpDate) <= latter) {
				diff[DAY]++;
			}
			incDate(accumulated, diff[DAY]);
		}

		const second = 1000;
		const minute = 60 * second;
		const hour = 60 * minute;
		let remainingTime = latter.getTime() - accumulated.getTime();

		if (units.includes(HOUR)) {
			diff[HOUR] = Math.floor(remainingTime / hour);
			remainingTime -= diff[HOUR] * hour;
		}

		if (units.includes(MINUTE)) {
			diff[MINUTE] = Math.floor(remainingTime / minute);
			remainingTime -= diff[MINUTE] * minute;
		}

		if (units.includes(SECOND)) {
			diff[SECOND] = Math.floor(remainingTime / second);
			remainingTime -= diff[SECOND] * second;
		}

		return diff;
	}

	/**
	 * @protected
	 */
	_initCalendarPredicates() {
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = Unit;

		this._isWithin = {
			[YEAR]: (date, now, shift = 0) => date.getFullYear() === now.getFullYear() + shift,

			[MONTH]: (date, now, shift = 0) => date.getFullYear() === now.getFullYear() &&
				date.getMonth() === now.getMonth() + shift,

			[WEEK]: (date, now, shift = 0) => date.getFullYear() === now.getFullYear() &&
				isoWeekNumber(date) === isoWeekNumber(now) + shift,

			[DAY]: (date, now, shift = 0) => {
				const start = new Date(now);
				start.setHours(0, 0, 0, 0);
				start.setDate(start.getDate() + shift);
				const end = new Date(start);
				end.setHours(24); // Midnight of the next day technically

				return date >= start && date < end;
			},

			[HOUR]: (date, now, shift = 0) => {
				const start = new Date(now);
				start.setMinutes(0, 0, 0);
				start.setHours(start.getHours() + shift);
				const end = new Date(start);
				end.setMinutes(60);

				return date >= start && date < end;
			},

			[MINUTE]: (date, now, shift = 0) => {
				const start = new Date(now);
				start.setSeconds(0, 0);
				start.setMinutes(start.getMinutes() + shift);
				const end = new Date(start);
				end.setSeconds(60);

				return date >= start && date < end;
			},

			[SECOND]: (date, now, shift = 0) => {
				const start = new Date(now);
				start.setMilliseconds(0);
				start.setSeconds(start.getSeconds() + shift);
				const end = new Date(start);
				end.setMilliseconds(60);

				return date >= start && date < end;
			}
		};
	}

	/**
	 * @protected
	 */
	_initFormatRE() {
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
	 * Escape symbol defined by ESCAPE_SYMBOL, single quote by default.
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
		let pieces = string.split(ESCAPE_SYMBOL + ESCAPE_SYMBOL);
		pieces = pieces.map((piece) => piece.replace(new RegExp(ESCAPE_SYMBOL, 'g'), ''));

		return pieces.join(ESCAPE_SYMBOL);
	}

	/**
	 * @param {Locale} locale
	 * @protected
	 */
	_addLocalePacks(locale) {
		const dateLocale = reduceLocale(
			locale,
			(locale) => formatsData.hasOwnProperty(locale)
		);

		const relativeLocale = reduceLocale(
			locale,
			(locale) => relativeFormatsData.hasOwnProperty(locale)
		);

		if (dateLocale) {
			this._context.addPack(locale, new Pack({
				'datetime': {
					'calendar': formatsData[dateLocale]['calendar'],
					'dateTimeFormats': formatsData[dateLocale]['formats']['dateTime']
				}
			}));
		}

		if (relativeLocale) {
			this._context.addPack(locale, new Pack({
				'relative': relativeFormatsData[relativeLocale]
			}));
		}
	}

	/**
	 * @param {string} type Either 'time' or 'date'
	 * @param {Form} form
	 * @return {string}
	 * @protected
	 */
	_getFormatString(type, form) {
		const locale = this._context.getLocale();
		const minimalLocale = locale && reduceLocale(
			locale,
			(locale) => formatsData.hasOwnProperty(locale)
		);

		const fallbackLocale = this._context.getFallbackLocale();
		const minimalFallbackLocale = reduceLocale(
			fallbackLocale,
			(locale) => formatsData.hasOwnProperty(locale)
		);

		if (minimalLocale) {
			return formatsData[minimalLocale]['formats'][type][form] || '';
		} else if (minimalFallbackLocale) {
			return formatsData[minimalFallbackLocale]['formats'][type][form] || '';
		}

		return '';
	}
}


/**
 * As defined by unicode CLDR: http://cldr.unicode.org/translation/date-time#TOC-Symbols
 * @type {string}
 */
export const ESCAPE_SYMBOL = '\'';
