/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-present, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
goog.provide('zb.i18n.utils');


/**
 * @param {number} value
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 */
zb.i18n.utils.isInIntegerRange = (value, a, b) => {
	for (let i = a; i <= b; i++) {
		if (value === i) {
			return true;
		}
	}
	return false;
};
