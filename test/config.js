const path = require('path');

function resolveZbModule(name) {
	const packageJsonPath = require.resolve(`${name}/package.json`);
	const packageJsonContent = require(`${name}/package.json`); // eslint-disable-line global-require
	return path.resolve(path.dirname(packageJsonPath), packageJsonContent.module);
}

const zbPath = resolveZbModule('zombiebox');
const cutejsPath = resolveZbModule('cutejs');
const generatedPath = path.resolve(__dirname, 'generated');
const i18nPath = path.resolve(__dirname, '../lib');
const testsPath = 'lib';

const [zbFiles, cutejsFiles, generatedFiles, i18nFiles, testsFiles] =
	[zbPath, cutejsPath, generatedPath, i18nPath, testsPath].map((root) => root + '/**/*.js');

module.exports = (config) => {
	config.set({
		autoWatch: false,
		singleRun: true,

		frameworks: ['mocha', 'chai'],
		reporters: ['mocha'],
		browsers: ['ChromeHeadless'],

		files: [
			{type: 'module', pattern: zbFiles},
			{type: 'module', pattern: cutejsFiles},
			{type: 'module', pattern: generatedFiles},
			{type: 'module', pattern: i18nFiles},
			{type: 'module', pattern: testsFiles}
		],

		preprocessors: {
			[zbFiles]: ['module-resolver'],
			[cutejsFiles]: ['module-resolver'],
			[generatedFiles]: ['module-resolver'],
			[i18nFiles]: ['module-resolver'],
			[testsFiles]: ['module-resolver']
		},

		moduleResolverPreprocessor: {
			aliases: {
				'zb': zbPath,
				'cutejs': cutejsPath,
				'generated': generatedPath,
				'i18n': i18nPath
			},
			ecmaVersion: 10
		}
	});
};
