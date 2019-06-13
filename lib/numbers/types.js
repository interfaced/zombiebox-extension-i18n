/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @enum {string}
 */
export const CurrencySymbolType = {
	NARROW: 'narrow',
	FULL: 'full'
};


/**
 * @typedef {string}
 */
export let Currency;


/**
 * @typedef {{
 *     symbol: ?string,
 *     narrowSymbol: ?string
 * }}
 */
export let CurrencyFormat;


/**
 * @typedef {{
 *     delimiters: {
 *         decimal: string,
 *         group: string
 *     },
 *     currency: string
 * }}
 */
export let Format;
