var fs = require('fs');
var path = require('path');

var cldrPath = path.dirname(require.resolve('cldr-dates-modern'));
var localesPath = path.join(cldrPath, 'main');

var outputFile = __dirname + '/timedata.json';
var localesToExport = process.argv.slice(2);

function readLocales() {
	return new Promise(function(resolve, reject) {
		fs.readdir(localesPath, function(err, locales) {

			if (err) throw err;
			if (!locales) return;

			if (localesToExport.length) {
				locales = locales.filter(function(file) {
					return localesToExport.indexOf(file) !== -1;
				});
			}
			console.log('Exporting locales:', locales.join(', '));

			var result = {};

			return Promise.all(locales.map(function(locale) {
				return new Promise(function(resolve, reject) {
					var calendar = path.join(localesPath, locale, 'ca-gregorian.json');

					fs.readFile(calendar, 'utf8', function(err, content) {
						if (err) throw err;
						var data = JSON.parse(content);

						result[locale] = processLocale(locale, data);
						resolve();
					});
				});
			})).then(function() {resolve(result)});
		});
	});
}


function processLocale(locale, input) {
	var output = {};
	var calendar = input.main[locale].dates.calendars.gregorian;

	output.formats = {};
	output.formats.date = calendar.dateFormats;
	output.formats.time = calendar.timeFormats;
	output.formats.dateTime = {};

	['short', 'medium', 'full', 'long'].forEach(function(key) {
		var format = calendar.dateTimeFormats[key];

		format = format.replace('{0}', '[time]');
		format = format.replace('{1}', '[date]');

		output.formats.dateTime[key] = format;
	});

	output.calendar = {
		days: {},
		months: {}
	};

	var daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

	['wide', 'narrow', 'abbreviated'].forEach(function(form) {
		output.calendar.days[form] = {};
		Object.keys(calendar.days.format[form]).forEach(function(day) {
			var dayNumber = daysOfWeek.indexOf(day);
			output.calendar.days[form][dayNumber] = calendar.days.format[form][day];
		});

		output.calendar.months[form] = {};
		Object.keys(calendar.months.format[form]).forEach(function(monthNumber) {
			monthNumber = parseInt(monthNumber);
			output.calendar.months[form][monthNumber - 1] = calendar.months.format[form][monthNumber];
		});
	});

	output.calendar.dayPeriods = {
		am: calendar.dayPeriods.format.abbreviated.am,
		pm: calendar.dayPeriods.format.abbreviated.pm
	};

	return output;
}


function writeData(data) {
	fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
		if (err) throw err;
	});
}


readLocales().then(writeData);
