if (process.env['npm_config_production']) {
	process.exit(0);
}


var path = require('path');
var fs = require('fs');

// These packages are not valid modules because they have no .js files and therefore cannot be required
// which is needed for export scripts to work
var packages = ['cldr-core', 'cldr-dates-modern', 'cldr-numbers-modern'];

packages.forEach(function(pkg) {
	// This is a very silly assumption, modules can be anywhere but considering those are devDependencies it should work
	var modulePath = path.join('node_modules', pkg);

	fs.stat(modulePath, function(err, stat) {
		if (err && err.code === 'ENOENT') return;
		if (err) throw err;

		if (stat.isDirectory()) {
			var indexPath = path.join(modulePath, 'index.js');
			fs.closeSync(fs.openSync(indexPath, 'w'));
		}
	});
});
