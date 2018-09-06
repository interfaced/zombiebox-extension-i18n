describe('zb.i18n.plurals', function() {
	var plurals = zb.i18n.plurals;

	/**
	 * @param {number} start
	 * @param {number} count
	 * @return {Array.<number>}
	 */
	function range(start, count) {
		return Array
			.apply(0, new Array(count))
			.map(function(element, index) {
				return index + start;
			});
	}

	describe('"RU" locale', function() {
		it('Should provide valid logic for cardinal', function() {
			var cardinal = plurals.locales.ru.cardinal;

			expect(cardinal.forms).to.be.deep.equal([
				zb.i18n.plurals.Form.ONE,
				zb.i18n.plurals.Form.FEW,
				zb.i18n.plurals.Form.MANY,
				zb.i18n.plurals.Form.OTHER
			]);

			expect(cardinal.resolver(0)).to.be.equal(zb.i18n.plurals.Form.MANY);
			expect(cardinal.resolver(10)).to.be.equal(zb.i18n.plurals.Form.MANY);

			expect(cardinal.resolver(1)).to.be.equal(zb.i18n.plurals.Form.ONE);
			expect(cardinal.resolver(21)).to.be.equal(zb.i18n.plurals.Form.ONE);

			expect(cardinal.resolver(2)).to.be.equal(zb.i18n.plurals.Form.FEW);
			expect(cardinal.resolver(22)).to.be.equal(zb.i18n.plurals.Form.FEW);

			expect(cardinal.resolver(0.5)).to.be.equal(zb.i18n.plurals.Form.OTHER);
			expect(cardinal.resolver(1.5)).to.be.equal(zb.i18n.plurals.Form.OTHER);
		});

		it('Should provide valid logic for ordinal', function() {
			var ordinal = plurals.locales.ru.ordinal;

			expect(ordinal.forms).to.be.deep.equal([
				zb.i18n.plurals.Form.OTHER
			]);

			range(0, 1000).map(function(number) {
				expect(ordinal.resolver(number)).to.be.equal(zb.i18n.plurals.Form.OTHER);
			});
		});
	});

	describe('"EN" locale', function() {
		it('Should provide valid logic for cardinal', function() {
			var cardinal = plurals.locales.en.cardinal;

			expect(cardinal.forms).to.be.deep.equal([
				zb.i18n.plurals.Form.ONE,
				zb.i18n.plurals.Form.OTHER
			]);

			expect(cardinal.resolver(0)).to.be.equal(zb.i18n.plurals.Form.OTHER);
			expect(cardinal.resolver(1)).to.be.equal(zb.i18n.plurals.Form.ONE);

			range(2, 1000).map(function(number) {
				expect(cardinal.resolver(number)).to.be.equal(zb.i18n.plurals.Form.OTHER);
			});
		});

		it('Should provide valid logic for ordinal', function() {
			var ordinal = plurals.locales.en.ordinal;

			expect(ordinal.forms).to.be.deep.equal([
				zb.i18n.plurals.Form.ONE,
				zb.i18n.plurals.Form.TWO,
				zb.i18n.plurals.Form.FEW,
				zb.i18n.plurals.Form.OTHER
			]);

			expect(ordinal.resolver(1)).to.be.equal(zb.i18n.plurals.Form.ONE);
			expect(ordinal.resolver(21)).to.be.equal(zb.i18n.plurals.Form.ONE);

			expect(ordinal.resolver(2)).to.be.equal(zb.i18n.plurals.Form.TWO);
			expect(ordinal.resolver(22)).to.be.equal(zb.i18n.plurals.Form.TWO);

			expect(ordinal.resolver(3)).to.be.equal(zb.i18n.plurals.Form.FEW);
			expect(ordinal.resolver(33)).to.be.equal(zb.i18n.plurals.Form.FEW);

			expect(ordinal.resolver(0)).to.be.equal(zb.i18n.plurals.Form.OTHER);
			expect(ordinal.resolver(4)).to.be.equal(zb.i18n.plurals.Form.OTHER);
			expect(ordinal.resolver(100)).to.be.equal(zb.i18n.plurals.Form.OTHER);
		});
	});
});
