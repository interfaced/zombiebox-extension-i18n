/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.datetime.Form');
goog.provide('zb.i18n.datetime.Format');
goog.provide('zb.i18n.datetime.RELATIVE_TIME_SHIFT_VALUES');
goog.provide('zb.i18n.datetime.RelativeTimeFormat');
goog.provide('zb.i18n.datetime.RelativeTimeOptions');
goog.provide('zb.i18n.datetime.Unit');
goog.require('zb.i18n.pluralization.Form');


/**
 * @const {!Array<number>}
 */
zb.i18n.datetime.RELATIVE_TIME_SHIFT_VALUES = [-2, -1, 0, 1, 2];


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
 * @enum {string}
 */
zb.i18n.datetime.Unit = {
	YEAR: 'year',
	MONTH: 'month',
	WEEK: 'week',
	DAY: 'day',
	HOUR: 'hour',
	MINUTE: 'minute',
	SECOND: 'second'
};


/**
 * @typedef {{
 *     formats: {
 *         date: Object<zb.i18n.datetime.Form, string>,
 *         time: Object<zb.i18n.datetime.Form, string>,
 *         dateTime: Object<zb.i18n.datetime.Form, string>,
 *     },
 *     calendar: {
 *         days: {
 *             wide: Object<string, string>,
 *             narrow: Object<string, string>,
 *             abbreviated: Object<string, string>
 *         },
 *         months: {
 *             wide: Object<string, string>,
 *             narrow: Object<string, string>,
 *             abbreviated: Object<string, string>
 *         },
 *         dayPeriods: {
 *             am: string,
 *             pm: string
 *         }
 *     }
 * }}
 */
zb.i18n.datetime.Format;


/**
 * @typedef {Object<zb.i18n.datetime.Unit, {
 *     adverbs: Object<string, string>,
 *     future: Object<zb.i18n.pluralization.Form, string>,
 *     past: Object<zb.i18n.pluralization.Form, string>
 * }>}
 */
zb.i18n.datetime.RelativeTimeFormat;


/**
 * @typedef {{
 *     useAdverbs: (boolean|undefined),
 *     minUnit: (zb.i18n.datetime.Unit|undefined),
 *     maxUnit: (zb.i18n.datetime.Unit|undefined)
 * }}
 */
zb.i18n.datetime.RelativeTimeOptions;
