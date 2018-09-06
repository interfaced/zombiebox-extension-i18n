var path = require('path');


/**
 * @implements {IZBAddon}
 */
var extension = function() {};


/**
 * @return {string}
 */
extension.prototype.getName = function() {
	return 'i18n';
};


/**
 * @return {string}
 */
extension.prototype.getPublicDir = function() {
	return path.join(__dirname, 'lib');
};


/**
 * @return {Object}
 */
extension.prototype.getConfig = function() {
	return {};
};


/**
 * @type {IZBAddon}
 */
module.exports = extension;
