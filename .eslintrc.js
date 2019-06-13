const {join, dirname} = require('path');

function resolveModulePath(packageName) {
	const packageInfoPath = require.resolve(`${packageName}/package.json`);

	return join(dirname(packageInfoPath), require(packageInfoPath).module);
}

module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			...require('eslint-config-interfaced/overrides/esm'),
			files: ['lib/**/*.js', 'test/lib/**/*.js'],
			settings: {
				'import/resolver': {
					alias: [
						['zb', resolveModulePath('zombiebox')],
						['i18n', join(__dirname, 'lib')]
					]
				}
			}
		},
		{
			files: ['lib/**/*.js', 'test/lib/**/*.js'],
			rules: {
				'import/no-unresolved': ['error', {ignore: ['^generated/']}]
			}
		},
		{
			...require('eslint-config-interfaced/overrides/node'),
			files: ['generators/**/*.js', 'scripts/*.js', 'index.js', 'test/config.js']
		},
		{
			...require('eslint-config-interfaced/overrides/mocha-chai'),
			files: ['test/lib/**/*.js']
		}
	]
};
