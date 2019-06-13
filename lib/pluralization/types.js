/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @see http://cldr.unicode.org/index/cldr-spec/plural-rules
 * @enum {string}
 */
export const Form = {
	ZERO: 'zero',
	ONE: 'one',
	TWO: 'two',
	FEW: 'few',
	MANY: 'many',
	OTHER: 'other'
};


/**
 * @typedef {function(number): Form}
 */
export let PluralizationFunction;
