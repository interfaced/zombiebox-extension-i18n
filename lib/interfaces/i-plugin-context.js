/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2016-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Context, Locale} from '../types';
import Pack from '../pack';


/**
 * @record
 */
export default class IPluginContext {
	/**
	 * @param {Locale} locale
	 * @param {Pack} pack
	 */
	addPack(locale, pack) {}

	/**
	 * @param {string} key
	 * @param {Locale=} locale
	 * @return {boolean}
	 */
	hasKey(key, locale) {}

	/**
	 * @param {string} key
	 * @param {Context=} context
	 * @return {string}
	 */
	transKey(key, context) {}

	/**
	 * @return {?Locale}
	 */
	getLocale() {}

	/**
	 * @return {Locale}
	 */
	getFallbackLocale() {}
}
