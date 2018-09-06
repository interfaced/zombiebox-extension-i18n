// Note: spaces in Russian locale are non-breaking spaces (" "), be careful not to confuse them with regular spaces

describe('zb.i18n.Numbers', function() {
	var Numbers = zb.i18n.Numbers;
	var Service = zb.i18n.Service;
	var Pack = zb.i18n.Pack;

	it('Should be a constructor', function() {
		var i18n = new Service();
		var instance;
		expect(function() {
			instance = new Numbers(i18n);
		}).not.to.throw();
		expect(instance).to.be.instanceOf(Numbers);
	});

	it('Should be created by i18n service', function() {
		var i18n = new Service();

		expect(i18n.numbers).to.be.instanceOf(Numbers);
	});

	it('Should fallback to default separators when locale is not supported', function() {
		var i18n = new Service();
		i18n.setLocale('unsupported');
		i18n.setFallbackLocale('unsupported');

		expect(i18n.numbers.formatNumber(1000000.05)).to.equal('1000000.05');

		i18n.numbers.DEFAULT_DECIMAL_SEPARATOR = '%';
		i18n.numbers.DEFAULT_GROUP_SEPARATOR = '@@@';

		expect(i18n.numbers.formatNumber(1000000.05)).to.equal('1@@@000@@@000%05');
	});

	it('Should expose public methods', function() {
		var prototype = Numbers.prototype;
		expect(prototype.setLocale).to.be.a('function');
		expect(prototype.setFallbackLocale).to.be.a('function');
		expect(prototype.isLocaleSupported).to.be.a('function');

		expect(prototype.formatNumber).to.be.a('function');
		expect(prototype.formatCurrency).to.be.a('function');
	});

	describe('Number formatting', function() {
		var i18n = new Service();

		it('Should format integer numbers', function() {
			i18n.setLocale('ru-RU');
			expect(i18n.numbers.formatNumber(1000000)).to.equal('1 000 000');
			i18n.setLocale('en-US');
			expect(i18n.numbers.formatNumber(1000000)).to.equal('1,000,000');
		});

		it('Should format floating point numbers', function() {
			i18n.setLocale('ru-RU');
			expect(i18n.numbers.formatNumber(1.0005)).to.equal('1,0005');
			i18n.setLocale('en-US');
			expect(i18n.numbers.formatNumber(1.0005)).to.equal('1.0005');
		});

		it('Should format numbers with specified precision', function() {
			i18n.setLocale('ru-RU');
			expect(i18n.numbers.formatNumber(0.12, 5)).to.equal('0,12000');
			expect(i18n.numbers.formatNumber(0.123456, 3)).to.equal('0,123');
			expect(i18n.numbers.formatNumber(0.65, 0)).to.equal('0');
			expect(i18n.numbers.formatNumber(1, 2)).to.equal('1,00');
		});

		it('Method trans should automatically format numbers', function() {
			var service = new Service();

			service.setLocale('ru-RU');
			service.addPack('ru-RU', new Pack({
				'test': '[number]'
			}));

			expect(service.trans('test', {
				'number': 10000000
			})).to.be.equal('10 000 000');
		});
	});

	describe('Currency formatting', function() {
		var i18n = new Service();

		it('Should format currency', function() {
			i18n.setLocale('ru-RU');

			expect(i18n.numbers.formatCurrency(1000000, 'RUB')).to.equal('1 000 000 ₽');
			expect(i18n.numbers.formatCurrency(1000000, 'USD')).to.equal('1 000 000 $');

			i18n.setLocale('en-US');

			expect(i18n.numbers.formatCurrency(1000000, 'RUB')).to.equal('₽1,000,000');
			expect(i18n.numbers.formatCurrency(1000000, 'USD')).to.equal('$1,000,000');
		});

		it('Should should accept symbol type argument', function() {
			i18n.setLocale('ru-RU');

			expect(i18n.numbers.formatCurrency(1000000, 'AUD', false, zb.i18n.numbers.CurrencySymbolType.NARROW))
				.to.equal('1 000 000 $');

			expect(i18n.numbers.formatCurrency(1000000, 'AUD', false, zb.i18n.numbers.CurrencySymbolType.FULL))
				.to.equal('1 000 000 A$');
		});

		it('Should fallback to full symbol if narrow is not available', function() {
			i18n.setLocale('ru-RU');

			expect(i18n.numbers.formatCurrency(1000000, 'XOF')).to.equal('1 000 000 CFA');
		});

		it('Should fallback to currency name if no symbols available', function() {
			i18n.setLocale('ru-RU');

			expect(i18n.numbers.formatCurrency(1000000, 'WTF')).to.equal('1 000 000 WTF');
		});

		it('Should format with or without fractional part', function() {
			i18n.setLocale('ru-RU');

			expect(i18n.numbers.formatCurrency(100.5, 'USD')).to.equal('100 $');
			expect(i18n.numbers.formatCurrency(100.5, 'USD', false)).to.equal('100 $');
			expect(i18n.numbers.formatCurrency(100.5, 'USD', true)).to.equal('100,50 $');
			expect(i18n.numbers.formatCurrency(100, 'USD', true)).to.equal('100,00 $');
		});
	});
});
