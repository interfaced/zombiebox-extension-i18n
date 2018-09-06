/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.IPlugin');
goog.require('zb.i18n.IPluginContext');
goog.require('zb.i18n.Locale');


/**
 * @interface
 */
zb.i18n.IPlugin = class {
	/**
	 * @param {zb.i18n.IPluginContext} context
	 */
	setContext(context) {}

	/**
	 * @param {zb.i18n.Locale} locale
	 * @return {boolean}
	 */
	isLocaleSupported(locale) {}

	/**
	 * @param {zb.i18n.Locale} locale
	 */
	useLocale(locale) {}

	/**
	 * @param {zb.i18n.Locale} locale
	 */
	useFallbackLocale(locale) {}
};
