/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.numbers.Currency');
goog.provide('zb.i18n.numbers.CurrencyFormat');
goog.provide('zb.i18n.numbers.CurrencySymbolType');
goog.provide('zb.i18n.numbers.Format');

/**
 * @enum {string}
 */
zb.i18n.numbers.CurrencySymbolType = {
	NARROW: 'narrow',
	FULL: 'full'
};


/**
 * @typedef {string}
 */
zb.i18n.numbers.Currency;


/**
 * @typedef {{
 *     symbol: ?string,
 *     narrowSymbol: ?string
 * }}
 */
zb.i18n.numbers.CurrencyFormat;


/**
 * @typedef {{
 *     delimiters: {
 *         decimal: string,
 *         group: string
 *     },
 *     currency: string
 * }}
 */
zb.i18n.numbers.Format;
