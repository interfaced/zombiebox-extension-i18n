/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Locale} from './types';


/**
 * @param {number} value
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 */
export const isInIntegerRange = (value, a, b) => {
	for (let i = a; i <= b; i++) {
		if (value === i) {
			return true;
		}
	}
	return false;
};


/**
 * Reduces given locale by discarding tags from right to left and returns first that fits the predicate
 * @param {Locale} locale
 * @param {function(Locale): boolean} predicate
 * @return {?Locale}
 */
export const reduceLocale = (locale, predicate) => {
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
 * @param {number} year
 * @return {boolean}
 */
export const isLeapYear = (year) => {
	const divisibleBy4 = (year % 4 === 0);
	const divisibleBy100 = (year % 100 === 0);
	const divisibleBy400 = (year % 400 === 0);

	return divisibleBy4 && !divisibleBy100 || divisibleBy400;
};


/**
 * @param {number} year
 * @return {number}
 */
export const isoWeeksInYear = (year) => {
	const january1st = new Date(year, 0, 1);
	const day = january1st.getDay();
	if (day === 4 || isLeapYear(year) && day === 3) {
		return 53;
	}
	return 52;
};


/**
 * Note: ISO week assumes week starts on Monday which is not the case in a large portion of the World.
 * Note: Week start is defined by locale country, not language.
 * @see https://en.wikipedia.org/wiki/ISO_week_date#Calculating_the_week_number_of_a_given_date
 * @param {Date} date
 * @return {number}
 */
export const isoWeekNumber = (date) => {
	const yearStart = new Date(date.getFullYear(), 0, 1);
	const ordinalDate = Math.floor((date - yearStart) / 24 / 60 / 60 / 1000) + 1;

	let weekDay = date.getDay();
	if (weekDay === 0) { // Sunday
		weekDay = 7;
	}

	const isoWeek = Math.floor((ordinalDate - weekDay + 10) / 7);

	if (isoWeek < 1) {
		return isoWeeksInYear(date.getFullYear() - 1); // Last week of previous year
	} else if (isoWeek >= 52) {
		const weeksInThisYear = isoWeeksInYear(date.getFullYear());
		if (isoWeek > weeksInThisYear) {
			return 1; // First week of next year
		}
	}
	return isoWeek;
};
