/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Form as PluralizationForm} from '../pluralization/types';


/**
 * @const {!Array<number>}
 */
export const RELATIVE_TIME_SHIFT_VALUES = [-2, -1, 0, 1, 2];


/**
 * @enum {string}
 */
export const Form = {
	SHORT: 'short',
	MEDIUM: 'medium',
	FULL: 'full',
	LONG: 'long'
};


/**
 * @enum {string}
 */
export const Unit = {
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
 *         date: Object<Form, string>,
 *         time: Object<Form, string>,
 *         dateTime: Object<Form, string>,
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
export let Format;


/**
 * @typedef {Object<Unit, {
 *     adverbs: Object<string, string>,
 *     future: Object<PluralizationForm, string>,
 *     past: Object<PluralizationForm, string>
 * }>}
 */
export let RelativeTimeFormat;


/**
 * @typedef {{
 *     useAdverbs: (boolean|undefined),
 *     minUnit: (Unit|undefined),
 *     maxUnit: (Unit|undefined)
 * }}
 */
export let RelativeTimeOptions;
