const {iterateCLDRData, generateDataModule, convertJSONValueToAST} = require('../utils');

/**
 * @param {string} locale
 * @param {Object} input
 * @return {Object}
 */
function processRelativeFormats(locale, input) {
	const data = {};

	const cldrData = input['main'][locale]['dates']['fields'];
	const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];

	for (const unit of units) {
		data[unit] = {};
		data[unit]['adverbs'] = {};

		for (const time of ['future', 'past']) {
			data[unit][time] = {};

			const formats = cldrData[unit]['relativeTime-type-' + time];
			const pluralForms = Object.keys(formats)
				.map((key) => formats[key].replace('{0}', '[value]'));

			data[unit][time] = `[valuePlural:${pluralForms.join('|')}]`;
		}

		const unitData = cldrData[unit];
		Object.keys(unitData)
			.forEach((key) => {
				const adverbMatch = key.match(/relative-type-(-?\d+)/);
				if (adverbMatch) {
					data[unit]['adverbs'][adverbMatch[1]] = unitData[key];
				}
			});
	}

	return data;
}

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

		for (const [locale, localeData] of iterateCLDRData('cldr-dates-modern', 'ca-gregorian.json', locales)) {
			data[locale] = convertJSONValueToAST(processTimeData(locale, localeData));
		}

		return generateDataModule(
			'zb.i18n.datetime.data.formats',
			['zb.i18n.datetime.Format'],
			'zb.i18n.datetime.Format',
			data
		);
	},

	/**
	 * @param {Array<string>} locales
	 * @return {string}
	 */
	generateRelativeFormats(locales) {
		const data = {};

		for (const [locale, localeData] of iterateCLDRData('cldr-dates-modern', 'dateFields.json', locales)) {
			data[locale] = convertJSONValueToAST(processRelativeFormats(locale, localeData));
		}

		return generateDataModule(
			'zb.i18n.datetime.data.relative',
			['zb.i18n.datetime.RelativeTimeFormat'],
			'zb.i18n.datetime.RelativeTimeFormat',
			data
		);
	}
};

module.exports = generator;
