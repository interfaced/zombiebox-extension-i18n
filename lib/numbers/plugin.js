/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import currenciesData from 'generated/i18n/numbers/currencies';
import formatsData from 'generated/i18n/numbers/formats';
import {warn} from 'zb/console/console';
import {reduceLocale} from '../utils';
import IPlugin from '../interfaces/i-plugin';
import IPluginContext from '../interfaces/i-plugin-context';
import Pack from '../pack';
import {Locale} from '../types';
import {Currency, CurrencySymbolType} from './types';


/**
 * @implements {IPlugin}
 */
export default class Plugin {
	/**
	 */
	constructor() {
		/**
		 * @type {?IPluginContext}
		 * @protected
		 */
		this._context = null;

		/**
		 * @const {string}
		 */
		this.DEFAULT_GROUP_SEPARATOR = '';

		/**
		 * @const {string}
		 */
		this.DEFAULT_DECIMAL_SEPARATOR = '.';
	}

	/**
	 * @override
	 */
	setContext(context) {
		this._context = context;
	}

	/**
	 * @override
	 */
	isLocaleSupported(locale) {
		const minimalLocale = reduceLocale(
			locale,
			(locale) => formatsData.hasOwnProperty(locale)
		);
		return !!minimalLocale;
	}

	/**
	 * @override
	 */
	useLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePack(locale);
		} else {
			warn(`No numbers formats available for "${locale}"`);
		}
	}

	/**
	 * @override
	 */
	useFallbackLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePack(locale);
		} else {
			warn(`No numbers formats available for fallback locale "${locale}"`);
		}
	}

	/**
	 * @param {number} value
	 * @param {number=} precision
	 * @return {string}
	 */
	formatNumber(value, precision) {
		let result;
		let integerString = Math.floor(value).toString();

		const isInteger = value === parseInt(value, 10);
		const isGroupingRequired = integerString.length > 3;

		const locale = this._context.getLocale();

		if (isGroupingRequired) {
			const hasGroupDelimiter = !!locale && this._context.hasKey('numbers.formats.delimiters.group', locale);

			const groupSeparator = hasGroupDelimiter ?
				this._context.transKey('numbers.formats.delimiters.group') :
				this.DEFAULT_GROUP_SEPARATOR;

			// Separate string into groups of three digits (thousands)
			// starting from right ('10000000' -> '10 000 000')
			// TODO: Some numbering conventions may separate numbers differently,
			// TODO: for example Indian (1,00,00,000.0001)
			integerString = integerString.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
		}

		result = integerString;

		const fractionalPartRequired = isInteger && precision > 0 || !isInteger && precision !== 0;

		if (fractionalPartRequired) {
			const hasDecimalDelimiter = !!locale && this._context.hasKey('numbers.formats.delimiters.decimal', locale);

			const decimalSeparator = hasDecimalDelimiter ?
				this._context.transKey('numbers.formats.delimiters.decimal') :
				this.DEFAULT_DECIMAL_SEPARATOR;

			let fractionString;
			if (precision === undefined) {
				fractionString = value.toString();
			} else {
				fractionString = value.toFixed(precision);
			}

			fractionString = fractionString.split('.')[1];
			result += decimalSeparator + fractionString;
		}

		return result;
	}

	/**
	 * @param {number} value
	 * @param {Currency} currency
	 * @param {boolean=} fractional
	 * @param {CurrencySymbolType=} symbolType
	 * @return {string}
	 */
	formatCurrency(value, currency, fractional = false, symbolType = CurrencySymbolType.NARROW) {
		const precision = fractional ? 2 : 0;
		const isNarrow = symbolType === CurrencySymbolType.NARROW;

		const locale = this._context.getLocale();
		const fallbackLocale = this._context.getFallbackLocale();

		const get = (symbolType, locale) => {
			const keyString = `numbers.currencies.${currency}.${symbolType}`;
			return this._context.hasKey(keyString, locale) ? this._context.transKey(keyString) : null;
		};

		const symbol = (
			isNarrow && get('narrowSymbol', locale) || get('symbol', locale) ||
			isNarrow && get('narrowSymbol', fallbackLocale) || get('symbol', fallbackLocale) ||
			currency
		);

		return this._context.transKey('numbers.formats.currency', {
			'value': this.formatNumber(value, precision),
			'symbol': symbol
		});
	}

	/**
	 * @param {Locale} locale
	 * @protected
	 */
	_addLocalePack(locale) {
		const minimalLocale = reduceLocale(
			locale,
			(locale) => formatsData.hasOwnProperty(locale)
		);

		if (!minimalLocale) {
			return;
		}

		this._context.addPack(locale, new Pack({
			'numbers': {
				'formats': formatsData[minimalLocale],
				'currencies': currenciesData[minimalLocale]
			}
		}));
	}
}
