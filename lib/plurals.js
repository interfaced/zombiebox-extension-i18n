/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2011-2016, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Based on Universal i18n (https://github.com/yanickrochon/universal-i18n) that uses as source of data
 * http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
 */
goog.provide('zb.i18n.plurals');


/**
 * @enum {string}
 */
zb.i18n.plurals.Form = {
	ZERO: 'zero', // Depending on the language; where there's nothing
	ONE: 'one', // Depending on the language; where there's an unicity in number
	TWO: 'two', // Depending on the language; where there's a pair
	FEW: 'few', // Depending on the language; where there's a small amount
	MANY: 'many', // Depending on the language; where there's a fairly large amount
	OTHER: 'other' // Any other specification goes here. This is the default language key
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal1 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal2 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return (n >= 0 && n <= 1) ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal3 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		return i === 0 || n === 1 ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal4 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n100 = n % 100;
		return n === 0 ?
			zb.i18n.plurals.Form.ZERO :
			n === 1 ?
				zb.i18n.plurals.Form.ONE :
				n === 2 ?
					zb.i18n.plurals.Form.TWO :
					(n100 >= 3 && n100 <= 10) ?
						zb.i18n.plurals.Form.FEW :
						(n100 >= 11 && n100 <= 99) ?
							zb.i18n.plurals.Form.MANY :
							zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ZERO,
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal5 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		return i === 1 && v === 0 ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal6 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		return n10 === 1 && n100 !== 11 ?
			zb.i18n.plurals.Form.ONE :
			(n10 >= 2 && n10 <= 4) && !(n100 >= 12 && n100 <= 14) ?
				zb.i18n.plurals.Form.FEW :
				n10 === 0 || (n10 >= 5 && n10 <= 9) || (n100 >= 11 && n100 <= 14) ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal7 = {
	resolver: function(p) {
		return zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal8 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		var n1000000 = n % 1000000;
		return n10 === 1 && n100 !== 11 && n100 !== 71 && n100 !== 91 ?
			zb.i18n.plurals.Form.ONE :
			n10 === 2 && n100 !== 12 && n100 !== 72 && n100 !== 92 ?
				zb.i18n.plurals.Form.TWO :
				(n10 >= 3 && n10 <= 4) || n10 === 9 && !(n100 >= 10 && n100 <= 19) && !(n100 >= 70 && n100 <= 79) && !(n100 >= 90 && n100 <= 99) ?
					zb.i18n.plurals.Form.FEW :
					n !== 0 && n1000000 === 0 ?
						zb.i18n.plurals.Form.MANY :
						zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal9 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		var i10 = i % 10;
		var i100 = i % 100;
		var f10 = f % 10;
		var f100 = f % 100;
		return v === 0 && i10 === 1 && i100 !== 11 || f10 === 1 && f100 !== 11 ?
			zb.i18n.plurals.Form.ONE :
			v === 0 && (i10 >= 2 && i10 <= 4) && !(i100 >= 12 && i100 <= 14) || (f10 >= 2 && f10 <= 4) && !(f100 >= 12 && f100 <= 14) ?
				zb.i18n.plurals.Form.FEW :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal10 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		return i === 1 && v === 0 ?
			zb.i18n.plurals.Form.ONE :
			(i >= 2 && i <= 4) && v === 0 ?
				zb.i18n.plurals.Form.FEW :
				v !== 0 ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal11 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0; return n === 0 ?
			zb.i18n.plurals.Form.ZERO :
			n === 1 ?
				zb.i18n.plurals.Form.ONE :
				n === 2 ?
					zb.i18n.plurals.Form.TWO :
					n === 3 ?
						zb.i18n.plurals.Form.FEW :
						n === 6 ?
							zb.i18n.plurals.Form.MANY :
							zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ZERO,
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal12 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var t = Math.floor((n + '').split('.')[1]) || 0;
		return n === 1 || t !== 0 && i === 0 || i === 1 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal13 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		var i100 = i % 100;
		var f100 = f % 100;
		return v === 0 && i100 === 1 || f100 === 1 ?
			zb.i18n.plurals.Form.ONE :
			v === 0 && i100 === 2 || f100 === 2 ?
				zb.i18n.plurals.Form.TWO :
				v === 0 && (i100 >= 3 && i100 <= 4) || (f100 >= 3 && f100 <= 4) ?
					zb.i18n.plurals.Form.FEW :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal14 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		return i === 0 || i === 1 ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal15 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		var i10 = i % 10;
		var f10 = f % 10;
		return v === 0 && i === 1 || i === 2 || i === 3 || v === 0 && i10 !== 4 && i10 !== 6 && i10 !== 9 || v !== 0 && f10 !== 4 && f10 !== 6 && f10 !== 9 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal16 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 ?
				zb.i18n.plurals.Form.TWO :
				(n >= 3 && n <= 6) ?
					zb.i18n.plurals.Form.FEW :
					(n >= 7 && n <= 10) ?
						zb.i18n.plurals.Form.MANY :
						zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal17 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 || n === 11 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 || n === 12 ?
				zb.i18n.plurals.Form.TWO :
				(n >= 3 && n <= 10) || (n >= 13 && n <= 19) ?
					zb.i18n.plurals.Form.FEW :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER,
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal18 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var i10 = i % 10;
		var i100 = i % 100;
		return v === 0 && i10 === 1 ?
			zb.i18n.plurals.Form.ONE :
			v === 0 && i10 === 2 ?
				zb.i18n.plurals.Form.TWO :
				v === 0 && i100 === 0 || i100 === 20 || i100 === 40 || i100 === 60 || i100 === 80 ?
					zb.i18n.plurals.Form.FEW :
					v !== 0 ?
						zb.i18n.plurals.Form.MANY :
						zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal19 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var n10 = n % 10;
		return i === 1 && v === 0 ?
			zb.i18n.plurals.Form.ONE :
			i === 2 && v === 0 ?
				zb.i18n.plurals.Form.TWO :
				v === 0 && !(n >= 0 && n <= 10) && n10 === 0 ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER,
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal20 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var t = Math.floor((n + '').split('.')[1]) || 0;
		var i10 = i % 10;
		var i100 = i % 100;
		return t === 0 && i10 === 1 && i100 !== 11 || t !== 0 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal21 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 ?
				zb.i18n.plurals.Form.TWO :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal22 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 0 ?
			zb.i18n.plurals.Form.ZERO :
			n === 1 ?
				zb.i18n.plurals.Form.ONE :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ZERO,
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal23 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		return n === 0 ?
			zb.i18n.plurals.Form.ZERO :
			i === 0 || i === 1 && n !== 0 ?
				zb.i18n.plurals.Form.ONE :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ZERO,
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal24 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		return n10 === 1 && !(n100 >= 11 && n100 <= 19) ?
			zb.i18n.plurals.Form.ONE :
			(n10 >= 2 && n10 <= 9) && !(n100 >= 11 && n100 <= 19) ?
				zb.i18n.plurals.Form.FEW :
				f !== 0 ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal25 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		var f100 = f % 100;
		var f10 = f % 10;
		return n10 === 0 || (n100 >= 11 && n100 <= 19) || v === 2 && (f100 >= 11 && f100 <= 19) ?
			zb.i18n.plurals.Form.ZERO :
			n10 === 1 && n100 !== 11 || v === 2 && f10 === 1 && f100 !== 11 || v !== 2 && f10 === 1 ?
				zb.i18n.plurals.Form.ONE :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ZERO,
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal26 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		var i10 = i % 10;
		var f10 = f % 10;
		return v === 0 && i10 === 1 || f10 === 1 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal27 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var n100 = n % 100;
		return i === 1 && v === 0 ?
			zb.i18n.plurals.Form.ONE :
			v !== 0 || n === 0 || n !== 1 && (n100 >= 1 && n100 <= 19) ?
				zb.i18n.plurals.Form.FEW :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal28 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n100 = n % 100;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			n === 0 || (n100 >= 2 && n100 <= 10) ?
				zb.i18n.plurals.Form.FEW :
				(n100 >= 11 && n100 <= 19) ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER,
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal29 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var i10 = i % 10;
		var i100 = i % 100;
		return i === 1 && v === 0 ?
			zb.i18n.plurals.Form.ONE :
			v === 0 && (i10 >= 2 && i10 <= 4) && !(i100 >= 12 && i100 <= 14) ?
				zb.i18n.plurals.Form.FEW :
				v === 0 && i !== 1 && (i10 >= 0 && i10 <= 1) || v === 0 && (i10 >= 5 && i10 <= 9) || v === 0 && (i100 >= 12 && i100 <= 14) ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal30 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return (n >= 0 && n <= 2) && n !== 2 ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal31 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		return n === 1 && v === 0 ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal32 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var i10 = i % 10;
		var i100 = i % 100;
		return v === 0 && i10 === 1 && i100 !== 11 ?
			zb.i18n.plurals.Form.ONE :
			v === 0 && (i10 >= 2 && i10 <= 4) && !(i100 >= 12 && i100 <= 14) ?
				zb.i18n.plurals.Form.FEW :
				v === 0 && i10 === 0 || v === 0 && (i10 >= 5 && i10 <= 9) || v === 0 && (i100 >= 11 && i100 <= 14) ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal33 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		return i === 0 || n === 1 ?
			zb.i18n.plurals.Form.ONE :
			(n >= 2 && n <= 10) ?
				zb.i18n.plurals.Form.FEW :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal34 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var f = Math.floor((p + '').split('.')[1]) || 0;
		return n === 0 || n === 1 || i === 0 && f === 1 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal35 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var v = ((p + '').split('.')[1] || '').length;
		var i100 = i % 100;
		return v === 0 && i100 === 1 ?
			zb.i18n.plurals.Form.ONE :
			v === 0 && i100 === 2 ?
				zb.i18n.plurals.Form.TWO :
				v === 0 && (i100 >= 3 && i100 <= 4) || v !== 0 ?
					zb.i18n.plurals.Form.FEW :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.cardinal36 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return (n >= 0 && n <= 1) || (n >= 11 && n <= 99) ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal1 = {
	resolver: function(p) {
		return zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal2 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 || n === 5 || n === 7 || n === 8 || n === 9 || n === 10 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 || n === 3 ?
				zb.i18n.plurals.Form.TWO :
				n === 4 ?
					zb.i18n.plurals.Form.FEW :
					n === 6 ?
						zb.i18n.plurals.Form.MANY :
						zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal3 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var i10 = i % 10;
		var i100 = i % 100;
		var i1000 = i % 1000;
		return i10 === 1 || i10 === 2 || i10 === 5 || i10 === 7 || i10 === 8 || i100 === 20 || i100 === 50 || i100 === 70 || i100 === 80 ?
			zb.i18n.plurals.Form.ONE :
			i10 === 3 || i10 === 4 || i1000 === 100 || i1000 === 200 || i1000 === 300 || i1000 === 400 || i1000 === 500 || i1000 === 600 || i1000 === 700 || i1000 === 800 || i1000 === 900 ?
				zb.i18n.plurals.Form.FEW :
				i === 0 || i10 === 6 || i100 === 40 || i100 === 60 || i100 === 90 ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal4 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		return n10 === 2 || n10 === 3 && n100 !== 12 && n100 !== 13 ?
			zb.i18n.plurals.Form.FEW :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal5 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 || n === 3 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 ?
				zb.i18n.plurals.Form.TWO :
				n === 4 ?
					zb.i18n.plurals.Form.FEW :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal6 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 0 || n === 7 || n === 8 || n === 9 ?
			zb.i18n.plurals.Form.ZERO :
			n === 1 ?
				zb.i18n.plurals.Form.ONE :
				n === 2 ?
					zb.i18n.plurals.Form.TWO :
					n === 3 || n === 4 ?
						zb.i18n.plurals.Form.FEW :
						n === 5 || n === 6 ?
							zb.i18n.plurals.Form.MANY :
							zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ZERO,
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal7 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		return n10 === 1 && n100 !== 11 ?
			zb.i18n.plurals.Form.ONE :
			n10 === 2 && n100 !== 12 ?
				zb.i18n.plurals.Form.TWO :
				n10 === 3 && n100 !== 13 ?
					zb.i18n.plurals.Form.FEW :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal8 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal9 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 || n === 3 ?
				zb.i18n.plurals.Form.TWO :
				n === 4 ?
					zb.i18n.plurals.Form.FEW :
					n === 6 ?
						zb.i18n.plurals.Form.MANY :
						zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER,
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal10 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 || n === 5 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal11 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 11 || n === 8 || n === 80 || n === 800 ?
			zb.i18n.plurals.Form.MANY :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal12 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var i100 = i % 100;
		return i === 1 ?
			zb.i18n.plurals.Form.ONE :
			i === 0 || (i100 >= 2 && i100 <= 20) || i100 === 40 || i100 === 60 || i100 === 80 ?
				zb.i18n.plurals.Form.MANY :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal13 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		return n10 === 6 || n10 === 9 || n10 === 0 && n !== 0 ?
			zb.i18n.plurals.Form.MANY :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal14 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var i = Math.floor(n) || 0;
		var i10 = i % 10;
		var i100 = i % 100;
		return i10 === 1 && i100 !== 11 ?
			zb.i18n.plurals.Form.ONE :
			i10 === 2 && i100 !== 12 ?
				zb.i18n.plurals.Form.TWO :
				i10 === 7 || i10 === 8 && i100 !== 17 && i100 !== 18 ?
					zb.i18n.plurals.Form.MANY :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal15 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			n === 2 || n === 3 ?
				zb.i18n.plurals.Form.TWO :
				n === 4 ?
					zb.i18n.plurals.Form.FEW :
					zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.TWO,
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal16 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		return (n >= 1 && n <= 4) ? zb.i18n.plurals.Form.ONE : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal17 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		return n === 1 ?
			zb.i18n.plurals.Form.ONE :
			n10 === 4 && n100 !== 14 ?
				zb.i18n.plurals.Form.MANY :
				zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.MANY,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal18 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		return n10 === 1 || n10 === 2 && n100 !== 11 && n100 !== 12 ?
			zb.i18n.plurals.Form.ONE :
			zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.ONE,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {zb.i18n.plurals.ResolverWithForms}
 */
zb.i18n.plurals.ordinal19 = {
	resolver: function(p) {
		var n = Math.abs(p) || 0;
		var n10 = n % 10;
		var n100 = n % 100;
		return n10 === 3 && n100 !== 13 ? zb.i18n.plurals.Form.FEW : zb.i18n.plurals.Form.OTHER;
	},
	forms: [
		zb.i18n.plurals.Form.FEW,
		zb.i18n.plurals.Form.OTHER
	]
};


/**
 * @type {Object.<string, {
 *    cardinal: zb.i18n.plurals.ResolverWithForms,
 *    ordinal: zb.i18n.plurals.ResolverWithForms
 * }>}
 */
zb.i18n.plurals.locales = {
	'af': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ak': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'am': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ar': {
		cardinal: zb.i18n.plurals.cardinal4,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'as': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal2
	},
	'asa': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ast': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'az': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal3
	},
	'be': {
		cardinal: zb.i18n.plurals.cardinal6,
		ordinal: zb.i18n.plurals.ordinal4
	},
	'bem': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'bez': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'bg': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'bh': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'bm': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'bn': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal2
	},
	'bo': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'br': {
		cardinal: zb.i18n.plurals.cardinal8,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'brx': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'bs': {
		cardinal: zb.i18n.plurals.cardinal9,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ca': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal5
	},
	'ce': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'cgg': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'chr': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ckb': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'cs': {
		cardinal: zb.i18n.plurals.cardinal10,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'cy': {
		cardinal: zb.i18n.plurals.cardinal11,
		ordinal: zb.i18n.plurals.ordinal6
	},
	'da': {
		cardinal: zb.i18n.plurals.cardinal12,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'de': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'dsb': {
		cardinal: zb.i18n.plurals.cardinal13,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'dv': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'dz': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ee': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'el': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'en': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal7
	},
	'eo': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'es': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'et': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'eu': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'fa': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ff': {
		cardinal: zb.i18n.plurals.cardinal14,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'fi': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'fil': {
		cardinal: zb.i18n.plurals.cardinal15,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'fo': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'fr': {
		cardinal: zb.i18n.plurals.cardinal14,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'fur': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'fy': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ga': {
		cardinal: zb.i18n.plurals.cardinal16,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'gd': {
		cardinal: zb.i18n.plurals.cardinal17,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'gl': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'gsw': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'gu': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal9
	},
	'guw': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'gv': {
		cardinal: zb.i18n.plurals.cardinal18,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ha': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'haw': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'he': {
		cardinal: zb.i18n.plurals.cardinal19,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'hi': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal9
	},
	'hr': {
		cardinal: zb.i18n.plurals.cardinal9,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'hsb': {
		cardinal: zb.i18n.plurals.cardinal13,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'hu': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal10
	},
	'hy': {
		cardinal: zb.i18n.plurals.cardinal14,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'id': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ig': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ii': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'in': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'is': {
		cardinal: zb.i18n.plurals.cardinal20,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'it': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal11
	},
	'iu': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'iw': {
		cardinal: zb.i18n.plurals.cardinal19,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ja': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'jbo': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'jgo': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ji': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'jmc': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'jv': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'jw': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ka': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal12
	},
	'kab': {
		cardinal: zb.i18n.plurals.cardinal14,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kaj': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kcg': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kde': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kea': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kk': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal13
	},
	'kkj': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kl': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'km': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kn': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ko': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ks': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ksb': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ksh': {
		cardinal: zb.i18n.plurals.cardinal22,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ku': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'kw': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ky': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'lag': {
		cardinal: zb.i18n.plurals.cardinal23,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'lb': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'lg': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'lkt': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ln': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'lo': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'lt': {
		cardinal: zb.i18n.plurals.cardinal24,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'lv': {
		cardinal: zb.i18n.plurals.cardinal25,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'mas': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'mg': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'mgo': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'mk': {
		cardinal: zb.i18n.plurals.cardinal26,
		ordinal: zb.i18n.plurals.ordinal14
	},
	'ml': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'mn': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'mo': {
		cardinal: zb.i18n.plurals.cardinal27,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'mr': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal15
	},
	'ms': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'mt': {
		cardinal: zb.i18n.plurals.cardinal28,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'my': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nah': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'naq': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nb': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nd': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ne': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal16
	},
	'nl': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nn': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nnh': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'no': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nqo': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nr': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nso': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ny': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'nyn': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'om': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'or': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'os': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'pa': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'pap': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'pl': {
		cardinal: zb.i18n.plurals.cardinal29,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'prg': {
		cardinal: zb.i18n.plurals.cardinal25,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ps': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'pt': {
		cardinal: zb.i18n.plurals.cardinal30,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'pt-PT': {
		cardinal: zb.i18n.plurals.cardinal31,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'rm': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ro': {
		cardinal: zb.i18n.plurals.cardinal27,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'rof': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'root': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ru': {
		cardinal: zb.i18n.plurals.cardinal32,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'rwk': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sah': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'saq': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sdh': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'se': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'seh': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ses': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sg': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sh': {
		cardinal: zb.i18n.plurals.cardinal9,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'shi': {
		cardinal: zb.i18n.plurals.cardinal33,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'si': {
		cardinal: zb.i18n.plurals.cardinal34,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sk': {
		cardinal: zb.i18n.plurals.cardinal10,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sl': {
		cardinal: zb.i18n.plurals.cardinal35,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sma': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'smi': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'smj': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'smn': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sms': {
		cardinal: zb.i18n.plurals.cardinal21,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sn': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'so': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sq': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal17
	},
	'sr': {
		cardinal: zb.i18n.plurals.cardinal9,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ss': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ssy': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'st': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'sv': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal18
	},
	'sw': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'syr': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ta': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'te': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'teo': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'th': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ti': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'tig': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'tk': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'tl': {
		cardinal: zb.i18n.plurals.cardinal15,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'tn': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'to': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'tr': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ts': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'tzm': {
		cardinal: zb.i18n.plurals.cardinal36,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'ug': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'uk': {
		cardinal: zb.i18n.plurals.cardinal32,
		ordinal: zb.i18n.plurals.ordinal19
	},
	'ur': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'uz': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	've': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'vi': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal8
	},
	'vo': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'vun': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'wa': {
		cardinal: zb.i18n.plurals.cardinal2,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'wae': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'wo': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'xh': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'xog': {
		cardinal: zb.i18n.plurals.cardinal1,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'yi': {
		cardinal: zb.i18n.plurals.cardinal5,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'yo': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'zh': {
		cardinal: zb.i18n.plurals.cardinal7,
		ordinal: zb.i18n.plurals.ordinal1
	},
	'zu': {
		cardinal: zb.i18n.plurals.cardinal3,
		ordinal: zb.i18n.plurals.ordinal1
	}
};


/**
 * @typedef {{
 *     resolver: function(number):zb.i18n.plurals.Form,
 *     forms: Array.<zb.i18n.plurals.Form>
 * }}
 */
zb.i18n.plurals.ResolverWithForms;
