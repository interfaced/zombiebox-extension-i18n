import formats from 'generated/i18n/datetime/formats';
import Service from 'i18n/service';
import {Form, Unit} from 'i18n/datetime/types';
import DateTimePlugin from 'i18n/datetime/plugin';
import Tokenizer from 'i18n/datetime/tokenizer';

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

describe('Datetime plugin', () => {
	const RU = 'ru';
	const EN = 'en';
	const NONE = 'non-existent';

	function getDateStub(diff = 0) {
		const date = new Date(2030, 5, 4, 13, 42, 6);
		if (diff) {
			date.setTime(date.getTime() + diff);
		}
		return date;
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

		describe('All tokens against all locales sanity check', () => {
			const i18n = new Service();
			const date = getDateStub();

			const unimplemented = ['z', 'zz', 'zzz', 'zzzz'];

			Object.keys(i18n.time._tokenizer.tokens).forEach((token) => {
				if (unimplemented.indexOf(token) !== -1) {
					return;
				}

				Object.keys(formats).forEach((locale) => {
					i18n.setLocale(locale);

					const result = i18n.time._tokenizer.tokens[token](date);
					expect(result, `Token \`${token}\` with locale ${locale}`)
						.to.be.a('string')
						.and.not.be.empty
						.and.not.equal(token)
						.and.not.equal(date);
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
			expect(i18n.time.format(date, 'EEE MMM a s \'escaped\'')).to.equal('вт июн. pm 6 escaped');
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
				expect(i18n.time.getFullDate(date)).to.equal('вторник, 4 июня 2030 г.');
			});

			it('Method getShortDate should return correct Russian format', () => {
				expect(i18n.time.getShortDate(date)).to.equal('04.06.2030');
			});

			it('Method getFullDateTime should return correct Russian format', () => {
				expect(i18n.time.getFullDateTime(date)).to.equal('вторник, 4 июня 2030 г., 13:42:06');
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
				expect(i18n.time.getFullDate(date)).to.equal('Tuesday, June 4, 2030');
			});

			it('Method getShortDate should return correct US English format', () => {
				expect(i18n.time.getShortDate(date)).to.equal('6/4/30');
			});

			it('Method getFullDateTime should return correct US English format', () => {
				expect(i18n.time.getFullDateTime(date)).to.equal('Tuesday, June 4, 2030 at 1:42:06 pm');
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
			expect(i18n.time.getTime(date, Form.SHORT)).to.equal('13:42');
		});

		it('getDate method should provide valid date formatting', () => {
			expect(i18n.time.getDate(date, Form.MEDIUM)).to.equal('4 июн. 2030 г.');
		});

		it('getDateTime method should provide valid date and time formatting', () => {
			expect(i18n.time.getDateTime(
				date, Form.SHORT,
				Form.LONG,
				Form.SHORT
			))
				.to.equal('4 июня 2030 г., 13:42');
		});
	});

	describe('Relative time', () => {
		const {YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND} = Unit;
		let i18n;

		beforeEach(() => {
			i18n = new Service();
			i18n.setLocale(RU);
		});

		describe('Basic usage', () => {
			it('Should return relative time string', () => {
				const today = getDateStub();
				const later = getDateStub(ONE_WEEK + ONE_DAY + 3 * ONE_HOUR);
				const result = i18n.time.relative(later, today);

				expect(result).to.be.a('string').that.is.not.empty;
			});

			it('Should default to current date', () => {
				const date = getDateStub();
				const result = i18n.time.relative(date);
				const resultWithExplicitDate = i18n.time.relative(date, new Date());

				expect(result).to.equal(resultWithExplicitDate);
			});

			it('Should pluralize properly', () => {
				const today = getDateStub();
				const relative = (diff) => i18n.time.relative(getDateStub(diff), today, {useAdverbs: false});

				expect(relative(-ONE_DAY)).to.equal('1 день назад');
				expect(relative(-2 * ONE_DAY)).to.equal('2 дня назад');
				expect(relative(-5 * ONE_DAY)).to.equal('5 дней назад');
			});
		});

		describe('Adverbs', () => {
			it('Should use adverbs when available', () => {
				const today = getDateStub();
				const nextWeek = getDateStub(ONE_WEEK);
				const tomorrow = getDateStub(ONE_DAY);
				const afterTomorrow = getDateStub(2 * ONE_DAY);

				i18n.setLocale(RU);
				expect(i18n.time.relative(tomorrow, today)).to.equal('завтра');
				expect(i18n.time.relative(afterTomorrow, today)).to.equal('послезавтра');
				expect(i18n.time.relative(today, tomorrow)).to.equal('вчера');
				expect(i18n.time.relative(today, afterTomorrow)).to.equal('позавчера');
				expect(i18n.time.relative(nextWeek, today)).to.equal('на следующей неделе');

				i18n.setLocale(EN);
				expect(i18n.time.relative(tomorrow, today)).to.equal('tomorrow');
				expect(i18n.time.relative(today, tomorrow)).to.equal('yesterday');
				expect(i18n.time.relative(nextWeek, today)).to.equal('next week');
			});

			it('Should not use adverbs when not available', () => {
				const today = getDateStub();
				const afterTomorrow = getDateStub(2 * ONE_DAY);
				const fiveDaysAfter = getDateStub(5 * ONE_DAY);

				i18n.setLocale(RU);
				expect(i18n.time.relative(fiveDaysAfter, today)).to.equal('через 5 дней');

				i18n.setLocale(EN);
				expect(i18n.time.relative(afterTomorrow, today)).to.equal('in 2 days');
				expect(i18n.time.relative(today, afterTomorrow)).to.equal('2 days ago');
				expect(i18n.time.relative(fiveDaysAfter, today)).to.equal('in 5 days');
			});
		});

		describe('Options', () => {
			describe('useAdverbs', () => {
				let today;
				let tomorrow;

				before(() => {
					today = getDateStub();
					tomorrow = getDateStub(ONE_DAY);
				});

				it('Should be true by default', () => {
					expect(i18n.time.relative(tomorrow, today)).to.equal('завтра');
				});

				it('Should be configurable', () => {
					expect(i18n.time.relative(tomorrow, today, {
						useAdverbs: true
					})).to.equal('завтра');

					expect(i18n.time.relative(tomorrow, today, {
						useAdverbs: false
					})).to.equal('через 1 день');
				});
			});

			describe('minUnit & maxUnit', () => {
				let today;
				let nextYear;
				let tenMinutesFromNow;

				before(() => {
					today = getDateStub();
					nextYear = getDateStub();
					nextYear.setYear(nextYear.getFullYear() + 1);
					tenMinutesFromNow = getDateStub(10 * ONE_MINUTE);
				});

				it('Should select smallest unit automatically by default', () => {
					expect(i18n.time.relative(nextYear, today)).to.equal('в следующем году');
					expect(i18n.time.relative(tenMinutesFromNow, today)).to.equal('через 10 минут');
				});

				it('maxUnit should limit result unit', () => {
					expect(i18n.time.relative(nextYear, today, {
						maxUnit: HOUR
					})).to.equal('через 8 760 часов');

					expect(i18n.time.relative(tenMinutesFromNow, today, {
						maxUnit: SECOND
					})).to.equal('через 600 секунд');
				});

				it('minUnit should limit result unit', () => {
					expect(i18n.time.relative(tenMinutesFromNow, today, {
						minUnit: MONTH
					})).to.equal('в этом месяце');

					expect(i18n.time.relative(tenMinutesFromNow, today, {
						minUnit: HOUR
					})).to.equal('в этот час');

					expect(i18n.time.relative(today, tenMinutesFromNow, {
						minUnit: HOUR
					})).to.equal('в этот час');
				});

				it('Should limit output to any desired unit', () => {
					const now = getDateStub();
					const notNow = getDateStub(
						5 * ONE_DAY +
						4 * ONE_HOUR +
						28 * ONE_MINUTE +
						55 * ONE_SECOND
					);
					notNow.setYear(now.getFullYear() + 3);
					notNow.setMonth(now.getMonth() + 2);

					const resultsMap = {
						[YEAR]: 'через 3 года',
						[MONTH]: 'через 38 месяцев',
						[WEEK]: 'через 166 недель',
						[DAY]: 'через 1 162 дня',
						[HOUR]: 'через 27 892 часа',
						[MINUTE]: 'через 1 673 548 минут',
						[SECOND]: 'через 100 412 935 секунд'
					};

					for (const [unit, result] of Object.entries(resultsMap)) {
						expect(i18n.time.relative(notNow, today, {
							maxUnit: unit,
							minUnit: unit
						}), unit).to.equal(result);
					}
				});

				it('Should throw Error when misconfigured', () => {
					expect(() => {
						i18n.time.relative(today, tenMinutesFromNow, {
							minUnit: MONTH,
							maxUnit: MINUTE
						});
					}).to.throw('Invalid configuration: Cannot select a unit with minUnit: month and maxUnit: minute');
				});
			});
		});

		describe('Edge cases', () => {
			it('Should work with leap years', () => {
				const prevYear = new Date(2019, 0, 1, 0, 0, 0);
				const leapYear = new Date(2020, 0, 1, 0, 0, 0);
				const nextYear = new Date(2021, 0, 1, 0, 0, 0);

				expect(i18n.time.relative(leapYear, prevYear), 'To leap year').to.equal('в следующем году');
				expect(i18n.time.relative(nextYear, leapYear), 'From leap year').to.equal('в следующем году');
			});

			it('Should factor variable month length', () => {
				const august1st = new Date(2030, 7, 1, 0, 0, 0);
				const august31st = new Date(2030, 7, 31, 0, 0, 0);

				// 30 DAYS between two days, but not a MONTH
				expect(i18n.time.relative(august31st, august1st)).to.equal('через 4 недели');
				expect(i18n.time.relative(august31st, august1st, {
					minUnit: MONTH
				})).to.equal('в этом месяце');

				const january31st = new Date(2030, 0, 31, 0, 0, 0);
				const march3rd = new Date(2030, 2, 3, 0, 0, 0);

				// 30 DAYS between two days, a full calendar month in between, but it is not "next month"
				expect(i18n.time.relative(march3rd, january31st)).to.equal('через 1 месяц');
			});
		});
	});

	describe('Errors and exceptional cases', () => {
		it('Should work with fallback locale', () => {
			const i18n = new Service();
			const date = getDateStub();

			i18n.setLocale(NONE);
			i18n.setFallbackLocale(EN);

			expect(i18n.time.getFullDate(date)).to.equal('Tuesday, June 4, 2030');
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
