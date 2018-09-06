goog.require('zb.i18n.pluralization.Form');
goog.require('zb.i18n.pluralization.data.cardinals');
goog.require('zb.i18n.pluralization.data.forms');

const {
	ZERO,
	ONE,
	TWO,
	FEW,
	MANY,
	OTHER
} = zb.i18n.pluralization.Form;

const validForms = [ZERO, ONE, TWO, FEW, MANY, OTHER];
const testValues = [
	-10.5, -1,
	0, 1, 2, 3, 5, 12, 13, 100,
	Math.PI, 7.5, 1.9, 1.99, 1.999, 100.99, 10.9999,
	1.13, 1.01, 1.00, 13, // Examples from http://www.unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules
	100, 101, 1000, 1e6, 1e7 + 1, 1e8 + 2
];

describe('zb.i18n.pluralization.data', () => {
	const cardinals = zb.i18n.pluralization.data.cardinals;
	const forms = zb.i18n.pluralization.data.forms;

	/**
	 * @param {number} start
	 * @param {number} count
	 * @return {Array<number>}
	 */
	function range(start, count) {
		return Array
			.apply(0, new Array(count))
			.map((element, index) => index + start);
	}

	describe('"ru" language', () => {
		it('Should provide valid logic for cardinals', () => {
			const localeCardinal = cardinals['ru'];
			const localeForms = forms['ru'];

			expect(localeForms).to.be.deep.equal([
				ONE,
				FEW,
				MANY,
				OTHER
			]);

			expect(localeCardinal(1)).to.be.equal(ONE);
			expect(localeCardinal(21)).to.be.equal(ONE);

			expect(localeCardinal(2)).to.be.equal(FEW);
			expect(localeCardinal(22)).to.be.equal(FEW);

			expect(localeCardinal(0)).to.be.equal(MANY);
			expect(localeCardinal(10)).to.be.equal(MANY);

			expect(localeCardinal(0.5)).to.be.equal(OTHER);
			expect(localeCardinal(1.5)).to.be.equal(OTHER);
		});
	});

	describe('"en" language', () => {
		it('Should provide valid logic for cardinal', () => {
			const localeCardinal = cardinals['en'];
			const localeForms = forms['en'];

			expect(localeForms).to.be.deep.equal([
				ONE,
				OTHER
			]);

			expect(localeCardinal(0)).to.be.equal(OTHER);
			expect(localeCardinal(1)).to.be.equal(ONE);

			range(2, 1000).forEach((number) => {
				expect(localeCardinal(number)).to.be.equal(OTHER);
			});
		});
	});

	describe('All languages', () => {
		for (const [language, languageForms] of Object.entries(forms)) {
			it(`Should provide sane forms for ${language}`, () => {
				expect(validForms).to.include.members(languageForms);
			});
		}

		for (const [language, languageCardinal] of Object.entries(cardinals)) {
			it(`Should provide sane results for ${language}`, () => {
				testValues.forEach((value) => {
					expect(languageCardinal(value)).to.be.oneOf(validForms);
				});
			});
		}
	});

	describe.skip('Intl conformity', () => {
		// Known issues:
		// "yue" – Intl and CLDR provide different results. Which one is correct is unknown

		for (const [language, languageCardinal] of Object.entries(cardinals)) {
			it(`Should provide same results as Intl api for "${language}"`, () => {
				const intlCardinal = new Intl.PluralRules(language);

				testValues.forEach((value) => {
					expect(languageCardinal(value), `value ${value}`).to.equal(intlCardinal.select(value));
				});
			});
		}
	});
});
