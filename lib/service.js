/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.Service');
goog.require('zb.console');
goog.require('zb.i18n.Context');
goog.require('zb.i18n.IPlugin');
goog.require('zb.i18n.Locale');
goog.require('zb.i18n.Pack');
goog.require('zb.i18n.datetime.Plugin');
goog.require('zb.i18n.numbers.Plugin');
goog.require('zb.i18n.pluralization.Plugin');


/**
 */
zb.i18n.Service = class {
	/**
	 */
	constructor() {
		/**
		 * @type {zb.i18n.datetime.Plugin}
		 */
		this.time = new zb.i18n.datetime.Plugin();

		/**
		 * @type {zb.i18n.numbers.Plugin}
		 */
		this.numbers = new zb.i18n.numbers.Plugin();

		/**
		 * @type {zb.i18n.pluralization.Plugin}
		 */
		this.pluralization = new zb.i18n.pluralization.Plugin();

		/**
		 * @type {Array<zb.i18n.IPlugin>}
		 * @protected
		 */
		this._plugins = [this.time, this.numbers, this.pluralization];

		/**
		 * @type {Object<string, Array<zb.i18n.Pack>>}
		 * @protected
		 */
		this._packs = {};

		/**
		 * @type {?zb.i18n.Locale}
		 * @protected
		 */
		this._locale = null;

		/**
		 * @type {zb.i18n.Locale}
		 * @protected
		 */
		this._fallbackLocale = zb.i18n.Service.DEFAULT_FALLBACK_LOCALE;

		this._passContextToPlugins();
	}

	/**
	 * @param {zb.i18n.Locale} locale
	 */
	setLocale(locale) {
		this._locale = this._normalizeLocale(locale);
		this._plugins.forEach((plugin) => plugin.useLocale(/** @type {zb.i18n.Locale} */ (this._locale)));
	}

	/**
	 * @return {?zb.i18n.Locale}
	 */
	getLocale() {
		return this._locale;
	}

	/**
	 * @param {zb.i18n.Locale} locale
	 */
	setFallbackLocale(locale) {
		this._fallbackLocale = this._normalizeLocale(locale);
		this._plugins.forEach((plugin) => plugin.useFallbackLocale(this._fallbackLocale));
	}

	/**
	 * @return {zb.i18n.Locale}
	 */
	getFallbackLocale() {
		return this._fallbackLocale;
	}

	/**
	 * @param {zb.i18n.Locale} locale
	 * @param {zb.i18n.Pack} pack
	 */
	addPack(locale, pack) {
		const normalizedLocale = this._normalizeLocale(locale);

		if (!this._packs[normalizedLocale]) {
			this._packs[normalizedLocale] = [];
		}

		if (this._packs[normalizedLocale].indexOf(pack) !== -1) {
			throw new Error('Already added pack cannot be added again');
		}

		this._packs[normalizedLocale].unshift(pack);
	}

	/**
	 * @param {string} key
	 * @param {zb.i18n.Locale=} opt_locale
	 * @return {boolean}
	 */
	hasKey(key, opt_locale) {
		return this._findValueInPacks(opt_locale || this._locale || this._fallbackLocale, key) !== null;
	}

	/**
	 * @param {string} key
	 * @param {zb.i18n.Context=} opt_context
	 * @return {string}
	 */
	trans(key, opt_context) {
		let locale;
		let value;

		if (!this._locale) {
			locale = this._fallbackLocale;
			value = this._findValueInPacks(locale, key);
		} else {
			locale = /** @type {string} */ (this._locale);
			value = this._findValueInPacks(locale, key);

			if (!value) {
				zb.console.warn(
					`No translation found for key "${key}" in locale "${locale}". ` +
					`Falling back to "${this._fallbackLocale}"`
				);

				locale = this._fallbackLocale;
				value = this._findValueInPacks(locale, key);
			}
		}

		if (!value) {
			zb.console.warn(`No translation found for key "${key}" in locale "${locale}"`);
			return key;
		}

		if (opt_context) {
			value = this._interpolate(value, opt_context);
			value = this.pluralization.pluralize(locale, value, opt_context);
		}

		return value;
	}

	/**
	 * @param {zb.i18n.Locale} locale
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
	 * Attempts to normalize invalid or inconvenient locales.
	 * @param {string} locale
	 * @return {zb.i18n.Locale}
	 * @protected
	 */
	_normalizeLocale(locale) {
		const replacedLocale = locale.replace('_', '-');

		const parts = replacedLocale.split('-');
		const possibleLocales = [];
		parts.reduce((accumulated, current) => {
			possibleLocales.push(accumulated);
			return `${accumulated}-${current}`;
		});
		possibleLocales.push(replacedLocale);
		possibleLocales.reverse();

		for (let i = 0; i < possibleLocales.length; i++) {
			if (this.isLocaleSupported(possibleLocales[i])) {
				return possibleLocales[i];
			}
		}

		return replacedLocale;
	}

	/**
	 * @param {zb.i18n.Locale} locale
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
	 * @param {zb.i18n.Context} context
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
					new RegExp(zb.i18n.Service.INTERPOLATION_PATTERN.replace('%key%', key), 'g'),
					keyValue
				);
			});

		return value;
	}
};


/**
 * @const {string}
 */
zb.i18n.Service.DEFAULT_FALLBACK_LOCALE = 'en';


/**
 * @const {string}
 */
zb.i18n.Service.INTERPOLATION_PATTERN = '\\[%key%\\]';
