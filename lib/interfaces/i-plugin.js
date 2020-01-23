/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Locale} from '../types';
import IPluginContext from './i-plugin-context';


/**
 * @interface
 */
export default class IPlugin {
	/**
	 * @param {IPluginContext} context
	 */
	setContext(context) {}

	/**
	 * @param {Locale} locale
	 * @return {boolean}
	 */
	isLocaleSupported(locale) {}

	/**
	 * @param {Locale} locale
	 */
	useLocale(locale) {}

	/**
	 * @param {Locale} locale
	 */
	useFallbackLocale(locale) {}
}
