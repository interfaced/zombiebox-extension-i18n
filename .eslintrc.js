module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			files: ['lib/**/*.js', 'test/lib/**/*.js'],
			extends: 'interfaced/esm',
			settings: {
				'import/resolver': 'zombiebox'
			}
		},
		{
			files: ['lib/**/*.js'],
			plugins: [
				'header'
			],
			'rules': {
				'header/header': ['error', 'block', [
					'',
					' * This file is part of the ZombieBox package.',
					' *',
					{pattern: `\\* Copyright © 2016\\-${(new Date).getFullYear()}, Interfaced`},
					' *',
					' * For the full copyright and license information, please view the LICENSE',
					' * file that was distributed with this source code.',
					' '
				]]
			}
		},
		{
			files: ['generators/**/*.js', 'scripts/*.js', 'index.js', 'test/config.js'],
			extends: 'interfaced/node'
		},
		{
			files: ['test/lib/**/*.js'],
			extends: 'interfaced/mocha-chai',
			rules: {
				'import/no-unused-modules': 'off'
			}
		}
	]
};
