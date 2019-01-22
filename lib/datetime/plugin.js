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
goog.require('zb.i18n.datetime.RELATIVE_TIME_SHIFT_VALUES');
goog.require('zb.i18n.datetime.RelativeTimeOptions');
goog.require('zb.i18n.datetime.Tokenizer');
goog.require('zb.i18n.datetime.Unit');
goog.require('zb.i18n.datetime.data.formats');
goog.require('zb.i18n.datetime.data.relative');
goog.require('zb.i18n.utils');


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

		/**
		 * Each predicate returns whether the date is the same (shift = 0) unit as now or not
		 * with shift = 1 it returns if the date is the next calendar entity of the same unit or not
		 * @type {Object<zb.i18n.datetime.Unit, function(Date, Date, number): boolean>}
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
		const minimalDateLocale = zb.i18n.utils.reduceLocale(
			locale,
			(locale) => zb.i18n.datetime.data.formats.hasOwnProperty(locale)
		);

		const minimalRelativeLocale = zb.i18n.utils.reduceLocale(
			locale,
			(locale) => zb.i18n.datetime.data.relative.hasOwnProperty(locale)
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
			zb.console.warn(`No date-time formats available for "${locale}"`);
		}
	}

	/**
	 * @override
	 */
	useFallbackLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePacks(locale);
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
	 * @param {Date} date
	 * @param {Date} now
	 * @param {zb.i18n.datetime.RelativeTimeOptions} options
	 * @return {string}
	 */
	relative(date, now = new Date(), options = {}) {
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = zb.i18n.datetime.Unit;
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
	 * @param {!Array<zb.i18n.datetime.Unit>} units
	 * @return {?string}
	 * @protected
	 */
	_selectAdverb(date, now, units) {
		for (const unit of units) {
			for (const shift of zb.i18n.datetime.RELATIVE_TIME_SHIFT_VALUES) {
				const key = `relative.${unit}.adverbs.${shift.toFixed()}`;

				if (this._isWithin[unit](date, now, shift) && this._context.hasKey(key)) {
					return this._context.transKey(key);
				}
			}
		}

		return null;
	}

	/**
	 * @param {Object<zb.i18n.datetime.Unit, number>} diff
	 * @param {Array<zb.i18n.datetime.Unit>} candidateUnits
	 * @return {zb.i18n.datetime.Unit}
	 * @protected
	 */
	_selectRelativeUnit(diff, candidateUnits) {
		return candidateUnits.find((unit) => diff[unit] > 0) || candidateUnits[candidateUnits.length - 1];
	}

	/**
	 * @param {Date} a
	 * @param {Date} b
	 * @param {Array<zb.i18n.datetime.Unit>} units
	 * @return {Object<zb.i18n.datetime.Unit, number>}
	 * @protected
	 */
	_calendarDiff(a, b, units) {
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = zb.i18n.datetime.Unit;

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
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = zb.i18n.datetime.Unit;

		this._isWithin = {
			[YEAR]: (date, now, shift = 0) => date.getFullYear() === now.getFullYear() + shift,

			[MONTH]: (date, now, shift = 0) => date.getFullYear() === now.getFullYear() &&
				date.getMonth() === now.getMonth() + shift,

			[WEEK]: (date, now, shift = 0) => date.getFullYear() === now.getFullYear() &&
				zb.i18n.utils.isoWeekNumber(date) === zb.i18n.utils.isoWeekNumber(now) + shift,

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
	_addLocalePacks(locale) {
		const dateData = zb.i18n.datetime.data.formats;
		const relativeData = zb.i18n.datetime.data.relative;

		const dateLocale = zb.i18n.utils.reduceLocale(
			locale,
			(locale) => dateData.hasOwnProperty(locale)
		);

		const relativeLocale = zb.i18n.utils.reduceLocale(
			locale,
			(locale) => relativeData.hasOwnProperty(locale)
		);

		if (dateLocale) {
			this._context.addPack(locale, new zb.i18n.Pack({
				'datetime': {
					'calendar': dateData[dateLocale]['calendar'],
					'dateTimeFormats': dateData[dateLocale]['formats']['dateTime']
				}
			}));
		}

		if (relativeLocale) {
			this._context.addPack(locale, new zb.i18n.Pack({
				'relative': relativeData[relativeLocale]
			}));
		}
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
		const minimalLocale = locale && zb.i18n.utils.reduceLocale(
			locale,
			(locale) => Formats.hasOwnProperty(locale)
		);

		const fallbackLocale = this._context.getFallbackLocale();
		const minimalFallbackLocale = zb.i18n.utils.reduceLocale(
			fallbackLocale,
			(locale) => Formats.hasOwnProperty(locale)
		);

		if (minimalLocale) {
			return Formats[minimalLocale]['formats'][type][form] || '';
		} else if (minimalFallbackLocale) {
			return Formats[minimalFallbackLocale]['formats'][type][form] || '';
		}

		return '';
	}
};


/**
 * As defined by unicode CLDR: http://cldr.unicode.org/translation/date-time#TOC-Symbols
 * @type {string}
 */
zb.i18n.datetime.Plugin.ESCAPE_SYMBOL = '\'';
