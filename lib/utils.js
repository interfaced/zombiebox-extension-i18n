/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.utils');
goog.require('zb.i18n.Locale');


/**
 * @param {number} value
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 */
zb.i18n.utils.isInIntegerRange = (value, a, b) => {
	for (let i = a; i <= b; i++) {
		if (value === i) {
			return true;
		}
	}
	return false;
};


/**
 * @param {zb.i18n.Locale} locale
 * @param {function(zb.i18n.Locale): boolean} predicate
 * @return {?zb.i18n.Locale}
 */
zb.i18n.utils.reduceLocale = (locale, predicate) => {
	const parts = locale.split('-');
	const possibleLocales = [];

	parts.reduce((accumulated, current) => {
		possibleLocales.push(accumulated);
		return `${accumulated}-${current}`;
	});
	possibleLocales.push(locale);
	possibleLocales.reverse();

	return possibleLocales.find(predicate) || null;
};


/**
 * TODO: ISO week assumes week starts on Monday which is not the case in a large portion of the World.
 * Note: Week start is defined by locale country, not language
 *
 * @see https://en.wikipedia.org/wiki/ISO_week_date#Calculating_the_week_number_of_a_given_date
 * We ignore the edge cases (0 and 53) since we only need to compare two values.
 * @param {Date} date
 * @return {number}
 */
zb.i18n.utils.isoWeekNumber = (date) => {
	const yearStart = new Date(date.getFullYear(), 0, 1);
	const fullDays = Math.floor((date - yearStart) / 24 / 60 / 60 / 1000);

	return Math.floor((fullDays - (date.getDay() + 1) + 10) / 7);
};
