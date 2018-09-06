goog.require('zb.i18n.Service');
goog.require('zb.i18n.datetime.Form');
goog.require('zb.i18n.datetime.Plugin');
goog.require('zb.i18n.datetime.Tokenizer');
goog.require('zb.i18n.datetime.data.formats');

describe('zb.i18n.datetime.Plugin', () => {
	const DateTimePlugin = zb.i18n.datetime.Plugin;
	const Tokenizer = zb.i18n.datetime.Tokenizer;
	const Service = zb.i18n.Service;

	const RU = 'ru';
	const EN = 'en';
	const NONE = 'non-existent';

	function getDateStub() {
		return {
			getSeconds() {
				return 6;
			},
			getMinutes() {
				return 42;
			},
			getHours() {
				return 13;
			},
			getDate() {
				return 4;
			},
			getDay() {
				return 4;
			},
			getMonth() {
				return 5;
			},
			getFullYear() {
				return 2030;
			},
			getTime() {
				return 1906810926000;
			}, // UTC
			getMilliseconds() {
				return 115;
			}
		};
	}

	it('Should be a constructor', () => {
		let instance;
		expect(() => {
			instance = new DateTimePlugin();
		}).not.to.throw();
		expect(instance).to.be.instanceOf(DateTimePlugin);
	});

	it('Should be created by i18n service', () => {
		const i18n = new Service();

		expect(i18n.time).to.be.instanceOf(DateTimePlugin);
	});

	it('Should expose public methods', () => {
		const prototype = DateTimePlugin.prototype;
		expect(prototype.setContext).to.be.a('function');
		expect(prototype.isLocaleSupported).to.be.a('function');
		expect(prototype.useLocale).to.be.a('function');
		expect(prototype.useFallbackLocale).to.be.a('function');

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

	describe('Tokenizer', () => {
		it('Should be a constructor', () => {
			let instance;
			expect(() => {
				instance = new Tokenizer();
			}).not.to.throw();
			expect(instance).to.be.instanceOf(Tokenizer);
		});

		it('Should be created by i18n service', () => {
			const i18n = new Service();

			expect(i18n.time._tokenizer).to.be.instanceOf(Tokenizer);
		});

		describe('All tokens against all locales', () => {
			const i18n = new Service();
			const date = getDateStub();

			const unimplemented = ['z', 'zz', 'zzz', 'zzzz'];

			Object.keys(i18n.time._tokenizer.tokens).forEach((token) => {
				if (unimplemented.indexOf(token) !== -1) {
					return;
				}

				Object.keys(zb.i18n.datetime.data.formats).forEach((locale) => {
					i18n.setLocale(locale);

					it(`Token \`${token}\` should provide sane output for locale ${locale}`, () => {
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

	describe('format method', () => {
		let i18n;
		let date;

		before(() => {
			i18n = new Service();
			i18n.setLocale(RU);
			date = getDateStub();
		});

		it('Should process arbitrary format', () => {
			expect(i18n.time.format(date, 'EEE MMM a s \'escaped\'')).to.equal('чт июн. pm 6 escaped');
		});
	});


	describe('Basic Methods', () => {
		describe('Russian', () => {
			let i18n;
			let date;

			before(() => {
				i18n = new Service();
				i18n.setLocale(RU);
				date = getDateStub();
			});

			it('Method getFullTime should return correct Russian format', () => {
				expect(i18n.time.getFullTime(date)).to.equal('13:42:06');
			});

			it('Method getShortTime should return correct Russian format', () => {
				expect(i18n.time.getShortTime(date)).to.equal('13:42');
			});

			it('Method getFullDate should return correct Russian format', () => {
				expect(i18n.time.getFullDate(date)).to.equal('четверг, 4 июня 2030 г.');
			});

			it('Method getShortDate should return correct Russian format', () => {
				expect(i18n.time.getShortDate(date)).to.equal('04.06.2030');
			});

			it('Method getFullDateTime should return correct Russian format', () => {
				expect(i18n.time.getFullDateTime(date)).to.equal('четверг, 4 июня 2030 г., 13:42:06');
			});

			it('Method getShortDateTime should return correct Russian format', () => {
				expect(i18n.time.getShortDateTime(date)).to.equal('04.06.2030, 13:42');
			});
		});

		describe('English', () => {
			let i18n;
			let date;

			before(() => {
				i18n = new Service();
				i18n.setLocale(EN);
				date = getDateStub();
			});

			it('Method getFullTime should return correct US English format', () => {
				expect(i18n.time.getFullTime(date)).to.equal('1:42:06 pm');
			});

			it('Method getShortTime should return correct US English format', () => {
				expect(i18n.time.getShortTime(date)).to.equal('1:42 pm');
			});

			it('Method getFullDate should return correct US English format', () => {
				expect(i18n.time.getFullDate(date)).to.equal('Thursday, June 4, 2030');
			});

			it('Method getShortDate should return correct US English format', () => {
				expect(i18n.time.getShortDate(date)).to.equal('6/4/30');
			});

			it('Method getFullDateTime should return correct US English format', () => {
				expect(i18n.time.getFullDateTime(date)).to.equal('Thursday, June 4, 2030 at 1:42:06 pm');
			});

			it('Method getShortDateTime should return correct US English format', () => {
				expect(i18n.time.getShortDateTime(date)).to.equal('6/4/30, 1:42 pm');
			});
		});
	});

	describe('Date and time methods', () => {
		let i18n;
		let date;

		before(() => {
			i18n = new Service();
			i18n.setLocale(RU);
			date = getDateStub();
		});

		it('getTime method should provide valid time formatting', () => {
			expect(i18n.time.getTime(date, zb.i18n.datetime.Form.SHORT)).to.equal('13:42');
		});

		it('getDate method should provide valid date formatting', () => {
			expect(i18n.time.getDate(date, zb.i18n.datetime.Form.MEDIUM)).to.equal('4 июн. 2030 г.');
		});

		it('getDateTime method should provide valid date and time formatting', () => {
			expect(i18n.time.getDateTime(
				date, zb.i18n.datetime.Form.SHORT,
				zb.i18n.datetime.Form.LONG,
				zb.i18n.datetime.Form.SHORT
			))
				.to.equal('4 июня 2030 г., 13:42');
		});
	});

	describe('Errors and exceptional cases', () => {
		it('Should work with fallback locale', () => {
			const i18n = new Service();
			const date = getDateStub();

			i18n.setLocale(NONE);
			i18n.setFallbackLocale(EN);

			expect(i18n.time.getFullDate(date)).to.equal('Thursday, June 4, 2030');
		});

		it('Should return empty string when formatting can\'t be done', () => {
			const i18n = new Service();
			const date = getDateStub();

			i18n.setLocale(NONE);
			i18n.setFallbackLocale(NONE);

			expect(i18n.time.getFullDate(date)).to.equal('');
		});

		it('Should resolve 12h clock ambiguity correctly', () => {
			const i18n = new Service();
			const date = getDateStub();

			i18n.setLocale(EN);

			date.getHours = () => 0; // Midnight
			expect(i18n.time.format(date, 'h a')).to.equal('12 am');

			date.getHours = () => 12; // Noon
			expect(i18n.time.format(date, 'h a')).to.equal('12 pm');
		});
	});
});
