import cardinals from 'generated/i18n/pluralization/cardinals';
import forms from 'generated/i18n/pluralization/forms';
import {Form} from 'i18n/pluralization/types';

const {
	ZERO,
	ONE,
	TWO,
	FEW,
	MANY,
	OTHER
} = Form;

const validForms = Object.values(Form);
const testValues = [
	-10.5, -1,
	0, 1, 2, 3, 5, 12, 13, 100,
	Math.PI, 7.5, 1.9, 1.99, 1.999, 100.99, 10.9999,
	1.13, 1.01, 1.00, 13, // Examples from http://www.unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules
	100, 101, 1000, 1e6, 1e7 + 1, 1e8 + 2
];

describe('Pluralization data', () => {
	/**
	 * @param {number} start
	 * @param {number} end
	 * @return {Array<number>}
	 */
	function inclusiveRange(start, end) {
		return Array
			.apply(0, new Array(end - start + 1))
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

			inclusiveRange(2, 1000).forEach((number) => {
				expect(localeCardinal(number)).to.be.equal(OTHER);
			});
		});
	});

	describe('"ar" language', () => {
		it('Should provide valid logic for cardinal', () => {
			const localeCardinal = cardinals['ar'];
			const localeForms = forms['ar'];

			expect(localeForms).to.be.deep.equal([
				ZERO,
				ONE,
				TWO,
				FEW,
				MANY,
				OTHER
			]);

			expect(localeCardinal(0)).to.be.equal(ZERO);
			expect(localeCardinal(1)).to.be.equal(ONE);
			expect(localeCardinal(2)).to.be.equal(TWO);
			inclusiveRange(3, 10).forEach((number) => {
				expect(localeCardinal(number)).to.be.equal(FEW);
			});
			expect(localeCardinal(503)).to.be.equal(FEW);
			inclusiveRange(11, 99).forEach((number) => {
				expect(localeCardinal(number)).to.be.equal(MANY);
			});
			expect(localeCardinal(112)).to.be.equal(MANY);
			expect(localeCardinal(799)).to.be.equal(MANY);
			expect(localeCardinal(100)).to.be.equal(OTHER);
			expect(localeCardinal(101)).to.be.equal(OTHER);
		});
	});

	describe('All languages sanity check', () => {
		it(`Should provide sane forms`, () => {
			for (const [language, languageForms] of Object.entries(forms)) {
				expect(validForms, `Forms for ${language}`).to.include.members(languageForms);
			}
		});

		it(`Should provide sane results`, () => {
			for (const [language, languageCardinal] of Object.entries(cardinals)) {
				testValues.forEach((value) => {
					expect(languageCardinal(value), `Value ${value} in ${language}`).to.be.oneOf(validForms);
				});
			}
		});
	});

	describe.skip('Intl conformity', () => {
		// Known issues:
		// Value 10.9999 exposes several errors in CLDR data with Slavic languages

		for (const [language, languageCardinal] of Object.entries(cardinals)) {
			it(`Should provide same results as Intl api for "${language}"`, () => {
				const intlCardinal = new Intl.PluralRules(language);

				testValues.forEach((value) => {
					expect(languageCardinal(value), `Value ${value} in ${language}`)
						.to.equal(intlCardinal.select(value));
				});
			});
		}
	});
});
