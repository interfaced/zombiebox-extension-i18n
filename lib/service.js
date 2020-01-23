/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {warn} from 'zb/console/console';
import {Context, Locale} from './types';
import IPlugin from './interfaces/i-plugin';
import Pack from './pack';
import DateTimePlugin from './datetime/plugin';
import NumbersPlugin from './numbers/plugin';
import PluralizationPlugin from './pluralization/plugin';


/**
 */
export default class Service {
	/**
	 */
	constructor() {
		/**
		 * @type {DateTimePlugin}
		 */
		this.time = new DateTimePlugin();

		/**
		 * @type {NumbersPlugin}
		 */
		this.numbers = new NumbersPlugin();

		/**
		 * @type {PluralizationPlugin}
		 */
		this.pluralization = new PluralizationPlugin();

		/**
		 * @type {Array<IPlugin>}
		 * @protected
		 */
		this._plugins = [this.time, this.numbers, this.pluralization];

		/**
		 * @type {Object<string, Array<Pack>>}
		 * @protected
		 */
		this._packs = {};

		/**
		 * @type {?Locale}
		 * @protected
		 */
		this._locale = null;

		/**
		 * @type {Locale}
		 * @protected
		 */
		this._fallbackLocale = DEFAULT_FALLBACK_LOCALE;

		this._passContextToPlugins();
	}

	/**
	 * @param {Locale} locale
	 */
	setLocale(locale) {
		this._locale = locale;
		this._plugins.forEach((plugin) => plugin.useLocale(/** @type {Locale} */ (this._locale)));
	}

	/**
	 * @return {?Locale}
	 */
	getLocale() {
		return this._locale;
	}

	/**
	 * @param {Locale} locale
	 */
	setFallbackLocale(locale) {
		this._fallbackLocale = locale;
		this._plugins.forEach((plugin) => plugin.useFallbackLocale(this._fallbackLocale));
	}

	/**
	 * @return {Locale}
	 */
	getFallbackLocale() {
		return this._fallbackLocale;
	}

	/**
	 * @param {Locale} locale
	 * @param {Pack} pack
	 */
	addPack(locale, pack) {
		if (!this._packs[locale]) {
			this._packs[locale] = [];
		}

		if (this._packs[locale].indexOf(pack) !== -1) {
			throw new Error('Already added pack cannot be added again');
		}

		this._packs[locale].unshift(pack);
	}

	/**
	 * @param {string} key
	 * @param {Locale=} locale
	 * @return {boolean}
	 */
	hasKey(key, locale) {
		return this._findValueInPacks(locale || this._locale || this._fallbackLocale, key) !== null;
	}

	/**
	 * @param {string} key
	 * @param {Context=} context
	 * @return {string}
	 */
	trans(key, context) {
		let locale;
		let value;

		if (!this._locale) {
			locale = this._fallbackLocale;
			value = this._findValueInPacks(locale, key);
		} else {
			locale = /** @type {string} */ (this._locale);
			value = this._findValueInPacks(locale, key);

			if (!value) {
				warn(
					`No translation found for key "${key}" in locale "${locale}". ` +
					`Falling back to "${this._fallbackLocale}"`
				);

				locale = this._fallbackLocale;
				value = this._findValueInPacks(locale, key);
			}
		}

		if (!value) {
			warn(`No translation found for key "${key}" in locale "${locale}"`);
			return key;
		}

		if (context) {
			value = this._interpolate(value, context);
			value = this.pluralization.pluralize(locale, value, context);
		}

		return value;
	}

	/**
	 * @param {Locale} locale
	 * @return {boolean}
	 */
	isLocaleSupported(locale) {
		return this._plugins.every((plugin) => plugin.isLocaleSupported(locale));
	}

	/**
	 * @deprecated Use pluralization.setFormsSeparator instead
	 * @param {string} separator
	 */
	setPluralFormsSeparator(separator) {
		this.pluralization.setFormsSeparator(separator);
	}

	/**
	 * @deprecated Use pluralization.setValueStub instead
	 * @param {string} stub
	 */
	setPluralValueStub(stub) {
		this.pluralization.setValueStub(stub);
	}

	/**
	 * @protected
	 */
	_passContextToPlugins() {
		const context = {
			addPack: this.addPack.bind(this),
			hasKey: this.hasKey.bind(this),
			transKey: this.trans.bind(this),
			getLocale: this.getLocale.bind(this),
			getFallbackLocale: this.getFallbackLocale.bind(this)
		};

		this._plugins.forEach((plugin) => plugin.setContext(context));
	}

	/**
	 * @param {Locale} locale
	 * @param {string} key
	 * @return {?string}
	 * @protected
	 */
	_findValueInPacks(locale, key) {
		let foundValue = null;
		(this._packs[locale] || []).forEach((pack) => {
			if (foundValue) {
				return;
			}

			foundValue = pack.getValue(key);
		});

		return foundValue;
	}

	/**
	 * @param {string} rawValue
	 * @param {Context} context
	 * @return {string}
	 * @protected
	 */
	_interpolate(rawValue, context) {
		let value = rawValue;

		Object.keys(context)
			.forEach((key) => {
				let keyValue = context[key];

				if (typeof keyValue === 'number') {
					keyValue = this.numbers.formatNumber(keyValue);
				}

				value = value.replace(
					new RegExp(INTERPOLATION_PATTERN.replace('%key%', key), 'g'),
					keyValue
				);
			});

		return value;
	}
}


/**
 * @const {string}
 */
export const DEFAULT_FALLBACK_LOCALE = 'en';


/**
 * @const {string}
 */
export const INTERPOLATION_PATTERN = '\\[%key%\\]';
