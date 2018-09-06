/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.numbers.Plugin');
goog.require('zb.console');
goog.require('zb.i18n.IPlugin');
goog.require('zb.i18n.IPluginContext');
goog.require('zb.i18n.Locale');
goog.require('zb.i18n.Pack');
goog.require('zb.i18n.numbers.Currency');
goog.require('zb.i18n.numbers.CurrencySymbolType');
goog.require('zb.i18n.numbers.data.currencies');
goog.require('zb.i18n.numbers.data.formats');
goog.require('zb.i18n.utils');


/**
 * @implements {zb.i18n.IPlugin}
 */
zb.i18n.numbers.Plugin = class {
	/**
	 */
	constructor() {
		/**
		 * @type {?zb.i18n.IPluginContext}
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
		const minimalLocale = zb.i18n.utils.reduceLocale(
			locale,
			(locale) => zb.i18n.numbers.data.formats.hasOwnProperty(locale)
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
			zb.console.warn(`No numbers formats available for "${locale}"`);
		}
	}

	/**
	 * @override
	 */
	useFallbackLocale(locale) {
		if (this.isLocaleSupported(locale)) {
			this._addLocalePack(locale);
		} else {
			zb.console.warn(`No numbers formats available for fallback locale "${locale}"`);
		}
	}

	/**
	 * @param {number} value
	 * @param {number=} opt_precision
	 * @return {string}
	 */
	formatNumber(value, opt_precision) {
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

		const fractionalPartRequired = isInteger && opt_precision > 0 || !isInteger && opt_precision !== 0;

		if (fractionalPartRequired) {
			const hasDecimalDelimiter = !!locale && this._context.hasKey('numbers.formats.delimiters.decimal', locale);

			const decimalSeparator = hasDecimalDelimiter ?
				this._context.transKey('numbers.formats.delimiters.decimal') :
				this.DEFAULT_DECIMAL_SEPARATOR;

			let fractionString;
			if (opt_precision === undefined) {
				fractionString = value.toString();
			} else {
				fractionString = value.toFixed(opt_precision);
			}

			fractionString = fractionString.split('.')[1];
			result += decimalSeparator + fractionString;
		}

		return result;
	}

	/**
	 * @param {number} value
	 * @param {zb.i18n.numbers.Currency} currency
	 * @param {boolean=} opt_fractional
	 * @param {zb.i18n.numbers.CurrencySymbolType=} opt_symbolType
	 * @return {string}
	 */
	formatCurrency(value, currency, opt_fractional, opt_symbolType = zb.i18n.numbers.CurrencySymbolType.NARROW) {
		const precision = opt_fractional ? 2 : 0;
		const isNarrow = opt_symbolType === zb.i18n.numbers.CurrencySymbolType.NARROW;

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
			value: this.formatNumber(value, precision),
			symbol
		});
	}

	/**
	 * @param {zb.i18n.Locale} locale
	 * @protected
	 */
	_addLocalePack(locale) {
		const minimalLocale = zb.i18n.utils.reduceLocale(
			locale,
			(locale) => zb.i18n.numbers.data.formats.hasOwnProperty(locale)
		);

		if (!minimalLocale) {
			return;
		}

		this._context.addPack(locale, new zb.i18n.Pack({
			'numbers': {
				'formats': zb.i18n.numbers.data.formats[minimalLocale],
				'currencies': zb.i18n.numbers.data.currencies[minimalLocale]
			}
		}));
	}
};
