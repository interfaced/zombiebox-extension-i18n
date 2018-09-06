/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.pluralization.Form');
goog.provide('zb.i18n.pluralization.PluralizationFunction');

/**
 * @see http://cldr.unicode.org/index/cldr-spec/plural-rules
 * @enum {string}
 */
zb.i18n.pluralization.Form = {
	ZERO: 'zero',
	ONE: 'one',
	TWO: 'two',
	FEW: 'few',
	MANY: 'many',
	OTHER: 'other'
};


/**
 * @typedef {function(number): zb.i18n.pluralization.Form}
 */
zb.i18n.pluralization.PluralizationFunction;
