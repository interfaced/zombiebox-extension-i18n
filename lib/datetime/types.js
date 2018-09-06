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
 * @typedef {{
 *     formats: {
 *         date: Object<zb.i18n.datetime.Form, string>,
 *         time: Object<zb.i18n.datetime.Form, string>,
 *         short: string,
 *         medium: string,
 *         full: string,
 *         long: string
 *     },
 *     calendar: {
 *         months: {
 *             narrow: Object<string, string>,
 *             short: Object<string, string>,
 *             long: Object<string, string>
 *         },
 *         days: {
 *             narrow: Object<string, string>,
 *             short: Object<string, string>,
 *             long: Object<string, string>
 *         },
 *         dayPeriods: {
 *             am: string,
 *             pm: string
 *         }
 *     }
 * }}
 */
zb.i18n.datetime.Format;
