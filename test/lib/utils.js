goog.require('zb.i18n.utils');

describe('zb.i18n.utils', () => {
	describe('isInIntegerRange', () => {
		it('Should detect if integer is within given range', () => {
			expect(zb.i18n.utils.isInIntegerRange(4, 3, 5)).to.be.true;
			expect(zb.i18n.utils.isInIntegerRange(7, 3, 5)).to.be.false;
		});

		it('Should be inclusive', () => {
			expect(zb.i18n.utils.isInIntegerRange(3, 3, 5)).to.be.true;
			expect(zb.i18n.utils.isInIntegerRange(5, 3, 5)).to.be.true;
		});

		it('Should ignore non-integers', () => {
			expect(zb.i18n.utils.isInIntegerRange(3.6, 3, 5)).to.be.false;
		});
	});

	describe('reduceLocale', () => {
		it('Should return original locale if it\'s good enough', () => {
			expect(zb.i18n.utils.reduceLocale('foo-bar-baz', () => true)).to.equal('foo-bar-baz');
		});

		it('Should reduce to suitable locale', () => {
			expect(zb.i18n.utils.reduceLocale('foo-bar-baz', (locale) => locale === 'foo-bar')).to.equal('foo-bar');
		});

		it('Should reduce to null if nothing fits', () => {
			expect(zb.i18n.utils.reduceLocale('foo-bar', () => false)).to.equal(null);
		});
	});

	describe('isLeapYear', () => {
		it('Year 2000 should be leap year', () => expect(zb.i18n.utils.isLeapYear(2000)).to.be.true);
		it('Year 2004 should be leap year', () => expect(zb.i18n.utils.isLeapYear(2004)).to.be.true);
		it('Year 2009 should not be leap year', () => expect(zb.i18n.utils.isLeapYear(2009)).to.be.false);
		it('Year 2100 should not be leap year', () => expect(zb.i18n.utils.isLeapYear(2100)).to.be.false);
	});

	describe('isoWeeksInYear', () => {
		it('Year 2008 should have 52 weeks', () => expect(zb.i18n.utils.isoWeeksInYear(2009)).to.be.equal(53));
		it('Year 2009 should have 53 weeks', () => expect(zb.i18n.utils.isoWeeksInYear(2009)).to.be.equal(53));
		it('Year 2012 should have 52 weeks', () => expect(zb.i18n.utils.isoWeeksInYear(2012)).to.be.equal(52));
		it('Year 2015 should have 53 weeks', () => expect(zb.i18n.utils.isoWeeksInYear(2015)).to.be.equal(53));
		it('Year 2076 should have 53 weeks', () => expect(zb.i18n.utils.isoWeeksInYear(2076)).to.be.equal(53));
	});

	describe('isoWeekNumber', () => {
		it('Should provide correct logic when year starts Monday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2007, 0, 1))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2007, 0, 7))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2007, 0, 8))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2007, 0, 14))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2007, 0, 15))).to.equal(3);
		});

		it('Should provide correct logic when year starts Tuesday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2007, 11, 31))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2008, 0, 1))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2008, 0, 6))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2008, 0, 7))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2008, 0, 13))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2008, 0, 14))).to.equal(3);
		});

		it('Should provide correct logic when year starts Wednesday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2002, 11, 30))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2003, 0, 1))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2003, 0, 5))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2003, 0, 6))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2003, 0, 12))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2003, 0, 13))).to.equal(3);
		});

		it('Should provide correct logic when year starts Thursday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2008, 11, 29))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 0, 1))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 0, 2))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 0, 4))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 0, 5))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 0, 11))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 0, 13))).to.equal(3);
		});

		it('Should provide correct logic when year starts Friday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2009, 11, 28))).to.equal(53);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2010, 0, 1))).to.equal(53);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2010, 0, 3))).to.equal(53);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2010, 0, 4))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2010, 0, 10))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2010, 0, 11))).to.equal(2);
		});

		it('Should provide correct logic when year starts Saturday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2010, 11, 27))).to.equal(52);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2011, 0, 1))).to.equal(52);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2011, 0, 2))).to.equal(52);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2011, 0, 3))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2011, 0, 9))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2011, 0, 10))).to.equal(2);
		});

		it('Should provide correct logic when year starts Sunday', () => {
			expect(zb.i18n.utils.isoWeekNumber(new Date(2012, 0, 1))).to.equal(52);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2012, 0, 2))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2012, 0, 8))).to.equal(1);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2012, 0, 9))).to.equal(2);
			expect(zb.i18n.utils.isoWeekNumber(new Date(2012, 0, 15))).to.equal(2);
		});
	});
});
