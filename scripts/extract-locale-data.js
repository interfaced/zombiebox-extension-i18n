var fs = require('fs');
var path = require('path');

var cldrTimePath = path.dirname(require.resolve('cldr-dates-modern'));
cldrTimePath = path.join(cldrTimePath, 'main');

var cldrNumbersPath = path.dirname(require.resolve('cldr-numbers-modern'));
cldrNumbersPath = path.join(cldrNumbersPath, 'main');

var localesToExport = process.argv.slice(2);

function readLocales(dataPath, filename, processor) {
	return new Promise(function(resolve, reject) {
		fs.readdir(dataPath, function(err, locales) {

			if (err) throw err;
			if (!locales) return;

			if (localesToExport.length) {
				locales = locales.filter(function(file) {
					return localesToExport.indexOf(file) !== -1;
				});
			}
			console.log('Exporting locales:', locales.join(', '), '\nFrom', dataPath, '\n');

			var result = {};

			return Promise.all(locales.map(function(locale) {
				return readData(locale, path.join(dataPath, locale, filename), processor).then(function(data) {
					result[locale] = data;
				});
			})).then(function() {resolve(result)});
		});
	});
}


function readData(locale, filePath, processor) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filePath, 'utf8', function(err, content) {
			if (err) throw err;
			var data = JSON.parse(content);
			resolve(processor(locale, data));
		});
	});
}


function writeData(data, filename) {
	fs.writeFile(filename, JSON.stringify(data, null, '\t'), function(err) {
		if (err) throw err;
		console.log('Successfully wrote to', filename);
	});
}


function processTimeData(locale, input) {
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
			monthNumber = parseInt(monthNumber, 10);
			output.calendar.months[form][monthNumber - 1] = calendar.months.format[form][monthNumber];
		});
	});

	output.calendar.dayPeriods = {
		am: calendar.dayPeriods.format.abbreviated.am,
		pm: calendar.dayPeriods.format.abbreviated.pm
	};

	return output;
}


function processNumbersData(locale, input) {
	var output = {};

	var numbers = input.main[locale].numbers;
	var numberingSystem = numbers.defaultNumberingSystem;

	output.delimiters = {};
	output.delimiters.decimal = numbers['symbols-numberSystem-' + numberingSystem].decimal;
	output.delimiters.group = numbers['symbols-numberSystem-' + numberingSystem].group;

	var currencyFormat = numbers['currencyFormats-numberSystem-' + numberingSystem].standard;

	// see http://cldr.unicode.org/translation/number-patterns
	currencyFormat = currencyFormat.split(';')[0]; // This ignores cases when negative numbers are formatted differently
	currencyFormat = currencyFormat.replace(/[.,0#%E']+/, '[value]'); // This ignores escaped symbols
	currencyFormat = currencyFormat.replace('¤', '[symbol]');

	output.currency = currencyFormat;

	return output;
}

function processCurrenciesData(locale, input) {
	var output = {};

	var currencies = input.main[locale].numbers.currencies;

	for (var currency in currencies) if (currencies.hasOwnProperty(currency)) {
		var data = currencies[currency];

		if ((!data.symbol || currency === data.symbol) && !data['symbol-alt-narrow']) {
			continue;
		}

		output[currency] = {};

		if (data.symbol !== currency) {
			output[currency].symbol = data.symbol;
		}

		if (data.hasOwnProperty('symbol-alt-narrow')) {
			output[currency].narrowSymbol = data['symbol-alt-narrow'];
		}
	}

	return output;
}


readLocales(cldrTimePath, 'ca-gregorian.json', processTimeData).then(function(data) {
	writeData(data, path.join(__dirname, 'timedata.json'));
});


readLocales(cldrNumbersPath, 'numbers.json', processNumbersData).then(function(data) {
	writeData(data, path.join(__dirname, 'numbersdata.json'));
});


readLocales(cldrNumbersPath, 'currencies.json', processCurrenciesData).then(function(data) {
	writeData(data, path.join(__dirname, 'currenciesdata.json'));
});
