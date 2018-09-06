/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.Pack');



/**
 * @param {zb.i18n.Pack.Map} map
 * @constructor
 */
zb.i18n.Pack = function(map) {
	this._keySeparator = zb.i18n.Pack.DEFAULT_KEY_CHUNK_SEPARATOR;
	this._flatMap = this._flattenMap(this._map = map);
};


/**
 * @param {string} keySeparator
 */
zb.i18n.Pack.prototype.setKeySeparator = function(keySeparator) {
	this._keySeparator = keySeparator;
	this._flatMap = this._flattenMap(this._map);
};


/**
 * @param {string} key
 * @return {?string}
 */
zb.i18n.Pack.prototype.getValue = function(key) {
	return this._flatMap[key] || null;
};


/**
 * @param {!Object.<string, string>} forwardingMap
 */
zb.i18n.Pack.prototype.forwardKeys = function(forwardingMap) {
	Object
		.keys(this._flatMap)
		.forEach(function(keyFrom) {
			var keyTo = forwardingMap[keyFrom];
			if (keyTo) {
				this._flatMap[keyTo] = this._flatMap[keyFrom];
				delete this._flatMap[keyFrom];
			}
		}, this);
};


/**
 *
 * @param {zb.i18n.Pack.Map} map
 * @return {zb.i18n.Pack.FlatMap}
 * @protected
 */
zb.i18n.Pack.prototype._flattenMap = function(map) {
	var flatMap = {};

	/**
	 * @param {*} value
	 * @return {boolean}
	 */
	function isObject(value) {
		return Object.prototype.toString.call(value) === '[object Object]';
	}

	for (var firstKey in map) {
		if (!map.hasOwnProperty(firstKey)) {
			continue;
		}

		if (isObject(map[firstKey])) {
			var restFlatMap = this._flattenMap(/** @type {zb.i18n.Pack.Map} */ (map[firstKey]));

			for (var restKey in restFlatMap) {
				if (!restFlatMap.hasOwnProperty(restKey)) {
					continue;
				}

				flatMap[firstKey + this._keySeparator + restKey] = restFlatMap[restKey];
			}
		} else {
			flatMap[firstKey] = '' + map[firstKey];
		}
	}

	return flatMap;
};


/**
 * @type {zb.i18n.Pack.Map}
 * @protected
 */
zb.i18n.Pack.prototype._map;


/**
 * @type {zb.i18n.Pack.FlatMap}
 * @protected
 */
zb.i18n.Pack.prototype._flatMap;


/**
 * @type {string}
 * @protected
 */
zb.i18n.Pack.prototype._keySeparator;


/**
 * @const {string}
 */
zb.i18n.Pack.DEFAULT_KEY_CHUNK_SEPARATOR = '.';


/**
 * @typedef {!Object.<string, *>}
 */
zb.i18n.Pack.Map;


/**
 * @typedef {!Object.<string, string>}
 */
zb.i18n.Pack.FlatMap;
