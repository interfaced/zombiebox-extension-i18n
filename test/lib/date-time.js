describe('zb.i18n.DateTime', function() {
	var DateTime = zb.i18n.DateTime;
	var Tokenizer = zb.i18n.datetime.Tokenizer;
	var Service = zb.i18n.Service;
	var Pack = zb.i18n.Pack;

	var RU = 'ru';
	var EN = 'en';
	var NONE = 'non-existent';

	function getDateStub() {
		return {
			getSeconds: function() { return 6; },
			getMinutes: function() { return 42; },
			getHours: function() { return 13; },
			getDate: function() { return 4; },
			getDay: function() { return 4; },
			getMonth: function() { return 5; },
			getFullYear: function() { return 2030; },
			getTime: function() { return 1906810926000; },  // UTC
			getMilliseconds: function() { return 115; }
		};
	}

	it('Should be a constructor', function() {
		var i18n = new Service();
		var instance;
		expect(function() {
			instance = new DateTime(i18n);
		}).not.to.throw();
		expect(instance).to.be.instanceOf(DateTime);
	});

	it('Should be created by i18n service', function() {
		var i18n = new Service();

		expect(i18n.time).to.be.instanceOf(DateTime);
	});

	it('Should expose public methods', function() {
		var prototype = DateTime.prototype;
		expect(prototype.setLocale).to.be.a('function');
		expect(prototype.setFallbackLocale).to.be.a('function');
		expect(prototype.format).to.be.a('function');

		expect(prototype.getTime).to.be.a('function');
		expect(prototype.getDate).to.be.a('function');
		expect(prototype.getDateTime).to.be.a('function');

		expect(prototype.getFullTime).to.be.a('function');
		expect(prototype.getShortTime).to.be.a('function');
		expect(prototype.getFullDate).to.be.a('function');
		expect(prototype.getShortDate).to.be.a('function');
		expect(prototype.getFullDateTime).to.be.a('function');
		expect(prototype.getShortDateTime).to.be.a('function');
	});

	describe('Tokenizer', function() {
		it('Should be a constructor', function() {
			var i18n = new Service();
			var instance;
			expect(function() {
				instance = new Tokenizer(i18n);
			}).not.to.throw();
			expect(instance).to.be.instanceOf(Tokenizer);
		});

		it('Should be created by i18n service', function() {
			var i18n = new Service();

			expect(i18n.time._tokenizer).to.be.instanceOf(Tokenizer);
		});

		describe('All tokens against all locales', function() {
			var i18n = new Service(),
			    date = getDateStub();

			var unimplemented = ['z', 'zz', 'zzz', 'zzzz'];

			Object.keys(i18n.time._tokenizer.tokens).forEach(function(token) {

				if (unimplemented.indexOf(token) !== -1) {
					return;
				}

				Object.keys(zb.i18n.datetime.Formats).forEach(function(locale) {
					i18n.setLocale(locale);

					it('Token `' + token + '` should provide sane output for locale ' + locale, function() {
						expect(i18n.time._tokenizer.tokens[token](date))
							.to.be.a('string')
							.and.not.be.empty
							.and.not.equal(token)
							.and.not.equal(date);
					});
				});
			});
		});
	});

	describe('format method', function() {
		var i18n, date;

		before(function() {
			i18n = new Service();
			i18n.setLocale(RU);
			date = getDateStub();
		});

		it('Should process arbitrary format', function() {
			expect(i18n.time.format(date, 'EEE MMM a s \'escaped\'')).to.equal('чт июн. пп 6 escaped');
		});
	});


	describe('Basic Methods', function() {
		describe('Russian', function() {
			var i18n, date;

			before(function() {
				i18n = new Service();
				i18n.setLocale(RU);
				date = getDateStub();
			});

			it('Method getFullTime should return correct Russian format', function() {
				expect(i18n.time.getFullTime(date)).to.equal('13:42:06');
			});

			it('Method getShortTime should return correct Russian format', function() {
				expect(i18n.time.getShortTime(date)).to.equal('13:42');
			});

			it('Method getFullDate should return correct Russian format', function() {
				expect(i18n.time.getFullDate(date)).to.equal('четверг, 4 июня 2030 г.');
			});

			it('Method getShortDate should return correct Russian format', function() {
				expect(i18n.time.getShortDate(date)).to.equal('04.06.30');
			});

			it('Method getFullDateTime should return correct Russian format', function() {
				expect(i18n.time.getFullDateTime(date)).to.equal('четверг, 4 июня 2030 г., 13:42:06');
			});

			it('Method getShortDateTime should return correct Russian format', function() {
				expect(i18n.time.getShortDateTime(date)).to.equal('04.06.30, 13:42');
			});
		});

		describe('English', function() {
			var i18n, date;

			before(function() {
				i18n = new Service();
				i18n.setLocale(EN);
				date = getDateStub();
			});

			it('Method getFullTime should return correct US English format', function() {
				expect(i18n.time.getFullTime(date)).to.equal('1:42:06 pm');
			});

			it('Method getShortTime should return correct US English format', function() {
				expect(i18n.time.getShortTime(date)).to.equal('1:42 pm');
			});

			it('Method getFullDate should return correct US English format', function() {
				expect(i18n.time.getFullDate(date)).to.equal('Thursday, June 4, 2030');
			});

			it('Method getShortDate should return correct US English format', function() {
				expect(i18n.time.getShortDate(date)).to.equal('6/4/30');
			});

			it('Method getFullDateTime should return correct US English format', function() {
				expect(i18n.time.getFullDateTime(date)).to.equal('Thursday, June 4, 2030 at 1:42:06 pm');
			});

			it('Method getShortDateTime should return correct US English format', function() {
				expect(i18n.time.getShortDateTime(date)).to.equal('6/4/30, 1:42 pm');
			});
		});
	});

	describe('Date and time methods', function() {
		var i18n, date;

		before(function() {
			i18n = new Service();
			i18n.setLocale(RU);
			date = getDateStub();
		});

		it('getTime method should provide valid time formatting', function() {
			expect(i18n.time.getTime(date, zb.i18n.datetime.Form.SHORT)).to.equal('13:42');
		});

		it('getDate method should provide valid date formatting', function() {
			expect(i18n.time.getDate(date, zb.i18n.datetime.Form.MEDIUM)).to.equal('4 июн. 2030 г.');
		});

		it('getDateTime method should provide valid date and time formatting', function() {
			expect(i18n.time.getDateTime(date, zb.i18n.datetime.Form.SHORT, zb.i18n.datetime.Form.LONG, zb.i18n.datetime.Form.SHORT))
				.to.equal('4 июня 2030 г., 13:42');
		});
	});

	describe('Errors and exceptional cases', function() {
		it('Should work with fallback locale', function() {
			var i18n = new Service(),
				date = getDateStub();

			i18n.setLocale(NONE);
			i18n.setFallbackLocale(EN);

			expect(i18n.time.getFullDate(date)).to.equal('Thursday, June 4, 2030');
		});

		it('Should return empty string when formatting can\'t be done', function() {
			var i18n = new Service(),
				date = getDateStub();

			i18n.setLocale(NONE);
			i18n.setFallbackLocale(NONE);

			expect(i18n.time.getFullDate(date)).to.equal('');
		});

		it('Should resolve 12h clock ambiguity correctly', function() {
			var i18n = new Service(),
				date = getDateStub();

			i18n.setLocale(EN);

			date.getHours = function() { return 0 };    // Midnight
			expect(i18n.time.format(date, 'h a')).to.equal('12 am');

			date.getHours = function() { return 12 };   // Noon
			expect(i18n.time.format(date, 'h a')).to.equal('12 pm');
		});
	});
});
