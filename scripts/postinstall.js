const path = require('path');
const fs = require('fs');

// These packages are not valid modules because they have no .js files and
// therefore cannot be required which is needed for generators to work
// (see issue http://unicode.org/cldr/trac/ticket/10892 for more information)
const packages = ['cldr-core', 'cldr-dates-modern', 'cldr-numbers-modern'];

/**
 * @param {string} lookUpPath
 * @param {string} packageName
 * @param {function(string)} callback
 */
function loopUpPackagePath(lookUpPath, packageName, callback) {
	const modulesPath = path.join(lookUpPath, path.basename(lookUpPath) === 'node_modules' ? '' : 'node_modules');

	fs.stat(modulesPath, (err, stat) => {
		if ((err && err.code === 'ENOENT') || !stat.isDirectory()) {
			return;
		}

		const packagePath = path.join(modulesPath, packageName);
		fs.stat(packagePath, (err, stat) => {
			if ((err && err.code === 'ENOENT') || !stat.isDirectory()) {
				loopUpPackagePath(path.resolve(path.join(lookUpPath, '..')), packageName, callback);
			} else {
				callback(packagePath);
			}
		});
	});
}

packages.forEach((packageName) => {
	loopUpPackagePath(path.join(__dirname, '..'), packageName, (packagePath) => {
		fs.closeSync(fs.openSync(path.join(packagePath, 'index.js'), 'w'));
	});
});
