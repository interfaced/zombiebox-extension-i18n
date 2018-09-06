const fs = require('fs');
const path = require('path');
const {generateDataModule, convertJSONValueToAST} = require('../utils');

const cldrDatesPath = path.join(require.resolve('cldr-dates-modern'), '..', 'main');

/**
 * @param {string} locale
 * @param {Object} input
 * @return {Object}
 */
function processTimeData(locale, input) {
	const output = {};
	const calendar = input.main[locale].dates.calendars.gregorian;

	output.formats = {};
	output.formats.date = calendar.dateFormats;
	output.formats.time = calendar.timeFormats;
	output.formats.dateTime = {};

	['short', 'medium', 'full', 'long'].forEach((key) => {
		let format = calendar.dateTimeFormats[key];

		format = format.replace('{0}', '[time]');
		format = format.replace('{1}', '[date]');

		output.formats.dateTime[key] = format;
	});

	output.calendar = {
		days: {},
		months: {}
	};

	const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

	['wide', 'narrow', 'abbreviated'].forEach((form) => {
		output.calendar.days[form] = {};
		Object.keys(calendar.days.format[form])
			.forEach((day) => {
				const dayNumber = daysOfWeek.indexOf(day);
				output.calendar.days[form][dayNumber] = calendar.days.format[form][day];
			});

		output.calendar.months[form] = {};
		Object.keys(calendar.months.format[form])
			.forEach((monthNumberString) => {
				const monthNumber = parseInt(monthNumberString, 10);
				output.calendar.months[form][monthNumber - 1] = calendar.months.format[form][monthNumber];
			});
	});

	output.calendar.dayPeriods = {
		am: calendar.dayPeriods.format.abbreviated.am,
		pm: calendar.dayPeriods.format.abbreviated.pm
	};

	return output;
}

const generator = {
	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateFormats(locales) {
		const data = {};

		for (const locale of locales) {
			const dataPath = path.join(cldrDatesPath, locale, 'ca-gregorian.json');

			if (fs.existsSync(dataPath)) {
				data[locale] = convertJSONValueToAST(
					processTimeData(locale, JSON.parse(fs.readFileSync(dataPath, 'utf-8')))
				);
			}
		}

		return generateDataModule(
			'zb.i18n.datetime.data.formats',
			['zb.i18n.datetime.Format'],
			'zb.i18n.datetime.Format',
			data
		);
	}
};

module.exports = generator;
