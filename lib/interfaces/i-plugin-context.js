/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* eslint-disable interfaced/no-empty-method */

goog.provide('zb.i18n.IPluginContext');
goog.require('zb.i18n.Context');
goog.require('zb.i18n.Locale');
goog.require('zb.i18n.Pack');


/**
 * @record
 */
zb.i18n.IPluginContext = class {
	/**
	 * @param {zb.i18n.Locale} locale
	 * @param {zb.i18n.Pack} pack
	 */
	addPack(locale, pack) {}

	/**
	 * @param {string} key
	 * @param {zb.i18n.Locale=} opt_locale
	 * @return {boolean}
	 */
	hasKey(key, opt_locale) {}

	/**
	 * @param {string} key
	 * @param {zb.i18n.Context=} opt_context
	 * @return {string}
	 */
	transKey(key, opt_context) {}

	/**
	 * @return {?zb.i18n.Locale}
	 */
	getLocale() {}

	/**
	 * @return {zb.i18n.Locale}
	 */
	getFallbackLocale() {}
};
