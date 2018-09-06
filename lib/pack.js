/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.Pack');


/**
 */
zb.i18n.Pack = class {
	/**
	 * @param {zb.i18n.Pack.Map} map
	 */
	constructor(map) {
		/**
		 * @type {zb.i18n.Pack.Map}
		 * @protected
		 */
		this._map = map;

		/**
		 * @type {zb.i18n.Pack.FlatMap}
		 * @protected
		 */
		this._flatMap = this._flattenMap(map, zb.i18n.Pack.DEFAULT_KEY_CHUNK_SEPARATOR);
	}

	/**
	 * @param {string} keySeparator
	 */
	setKeySeparator(keySeparator) {
		this._flatMap = this._flattenMap(this._map, keySeparator);
	}

	/**
	 * @param {string} key
	 * @return {?string}
	 */
	getValue(key) {
		return this._flatMap[key] || null;
	}

	/**
	 * @param {!Object<string, string>} forwardingMap
	 */
	forwardKeys(forwardingMap) {
		Object.keys(this._flatMap)
			.forEach((keyFrom) => {
				const keyTo = forwardingMap[keyFrom];
				if (keyTo) {
					this._flatMap[keyTo] = this._flatMap[keyFrom];
					delete this._flatMap[keyFrom];
				}
			});
	}

	/**
	 *
	 * @param {zb.i18n.Pack.Map} map
	 * @param {string} keySeparator
	 * @return {zb.i18n.Pack.FlatMap}
	 * @protected
	 */
	_flattenMap(map, keySeparator) {
		const flatMap = {};

		/**
		 * @param {*} value
		 * @return {boolean}
		 */
		function isObject(value) {
			return Object.prototype.toString.call(value) === '[object Object]';
		}

		for (const firstKey in map) {
			if (!map.hasOwnProperty(firstKey)) {
				continue;
			}

			if (isObject(map[firstKey])) {
				const restFlatMap = this._flattenMap(/** @type {zb.i18n.Pack.Map} */ (map[firstKey]), keySeparator);

				Object.keys(restFlatMap).forEach((restKey) => {
					flatMap[firstKey + keySeparator + restKey] = restFlatMap[restKey];
				});
			} else {
				flatMap[firstKey] = map[firstKey].toString();
			}
		}

		return flatMap;
	}
};


/**
 * @const {string}
 */
zb.i18n.Pack.DEFAULT_KEY_CHUNK_SEPARATOR = '.';


/**
 * @typedef {!Object<string, *>}
 */
zb.i18n.Pack.Map;


/**
 * @typedef {!Object<string, string>}
 */
zb.i18n.Pack.FlatMap;
