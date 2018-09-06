describe('zb.i18n.Service', function() {
	var Service = zb.i18n.Service;
	var Pack = zb.i18n.Pack;

	// Fake logger
	window.zb.console = {
		error: sinon.spy()
	};

	it('Should be a constructor', function() {
		var instance;
		expect(function() {
			instance = new Service();
		}).not.to.throw();
		expect(instance).to.be.instanceOf(Service);
	});

	it('Should expose public methods', function() {
		var prototype = Service.prototype;
		expect(prototype.setLocale).to.be.a('function');
		expect(prototype.setFallbackLocale).to.be.a('function');
		expect(prototype.setPluralFormsSeparator).to.be.a('function');
		expect(prototype.setPluralValueStub).to.be.a('function');
		expect(prototype.addPack).to.be.a('function');
		expect(prototype.trans).to.be.a('function');
	});

	describe('Method "trans"', function() {
		it('Should translate existing key', function() {
			var service = new Service();

			service.setLocale('en');
			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});

		it('Should return key itself when one is not translatable', function() {
			var service = new Service();

			service.setLocale('en');
			service.addPack('en', new Pack({}));

			expect(service.trans('home')).to.be.equal('home');
		});

		it('Should giving higher priority for packs, that were added last', function() {
			var service = new Service();

			service.addPack('en', new Pack({
				'home': 'HOME'
			}));

			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});

		describe('Interpolation', function() {
			it('Should interpolate value', function() {
				var service = new Service();

				service.addPack('en', new Pack({
					'home': 'Home of [entity]'
				}));

				expect(service.trans('home', {
					'entity': 'the Brave'
				})).to.be.equal('Home of the Brave');
			});

			it('Should interpolate multiple values', function() {
				var service = new Service();

				service.addPack('en', new Pack({
					'home': 'Home of [entity] [entity]'
				}));

				expect(service.trans('home', {
					'entity': 'the Brave'
				})).to.be.equal('Home of the Brave the Brave');
			});

			it('Should not interpolate value without right context', function() {
				var service = new Service();

				service.addPack('en', new Pack({
					'home': 'Home of [entity]'
				}));

				expect(service.trans('home')).to.be.equal('Home of [entity]');
			});
		});

		describe('Pluralization', function() {
			it('Should pluralize value', function() {
				var service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 0})).to.be.equal('0 просмотров');
				expect(service.trans('views_plural', {views: 1})).to.be.equal('1 просмотр');
				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 просмотра');
				expect(service.trans('views_plural', {views: 1.5})).to.be.equal('1.5 просмотра');
			});

			it('Should pluralize multiple values', function() {
				var service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра] ' +
						'[viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 0})).to.be.equal('0 просмотров просмотров');
			});

			it('Should not pluralize value without right context', function() {
				var service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural'))
					.to.be.equal('[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]');
			});

			it('Should handle non number values in context', function() {
				var service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: '1000'})).to.be.equal('1000 просмотров');
				expect(service.trans('views_plural', {views: '1 000'})).to.be.equal('1 000 просмотров');
			});

			it('Should handle float values in context', function() {
				var service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 1.5})).to.be.equal('1.5 просмотра');
				expect(service.trans('views_plural', {views: '1.5'})).to.be.equal('1.5 просмотра');
			});

			it('Should log error when pluralization is failed', function() {
				var service = new Service();

				service.setLocale('invalid');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				service.trans('views_plural', {views: 1});
				expect(zb.console.error).to.have.been
					.calledOnce.and
					.calledWith('Can\'t pluralize ' +
						'"1 [viewsPlural:просмотр|просмотра|просмотров|просмотра]" with locale "invalid"'
					);
			});

			it('Should stub value when locale is invalid', function() {
				var service = new Service();

				service.setLocale('invalid');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 ???');
			});

			it('Should stub value when context is invalid', function() {
				var service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр*просмотра*просмотров*просмотра]'
				}));

				expect(service.trans('views_plural', {views: 'foo'})).to.be.equal('foo ???');
			});

			it('Should stub value when there is no suitable form', function() {
				var service = new Service();

				service.setLocale('invalid');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр]'
				}));

				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 ???');
			});

			it('Method "setPluralFormsSeparator" should provide valid logic', function() {
				var service = new Service();

				service.setLocale('ru');
				service.setPluralFormsSeparator('*');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр*просмотра*просмотров*просмотра]'
				}));

				expect(service.trans('views_plural', {views: 0})).to.be.equal('0 просмотров');
				expect(service.trans('views_plural', {views: 1})).to.be.equal('1 просмотр');
				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 просмотра');
				expect(service.trans('views_plural', {views: 1.5})).to.be.equal('1.5 просмотра');
			});

			it('Method "setPluralValueStub" should provide valid logic', function() {
				var service = new Service();

				service.setLocale('invalid');
				service.setPluralValueStub('***');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 ***');
			});
		});
	});

	describe('Method "addPack"', function() {
		it('Should add new pack', function() {
			var service = new Service();

			service.setLocale('en');
			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});

		it('Should not add already added pack', function() {
			var service = new Service();
			var pack = new Pack({});

			service.addPack('en', pack);
			expect(function() {
				service.addPack('en', pack);
			}).to.throw();

			expect(function() {
				service.addPack('en_GB', pack);
			}).not.to.throw();
		});
	});

	describe('Method "setLocale"', function() {
		it('Should use specified locale', function() {
			var service = new Service();

			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			service.addPack('ru', new Pack({
				'home': 'Главная'
			}));

			service.setLocale('en');
			expect(service.trans('home')).to.be.equal('Home');

			service.setLocale('ru');
			expect(service.trans('home')).to.be.equal('Главная');
		});
	});

	describe('Method "setFallbackLocale"', function() {
		it('Should use specified locale as fallback', function() {
			var service = new Service();

			service.addPack('en', new Pack({}));
			service.addPack('ru', new Pack({
				'home': 'Главная'
			}));

			service.setLocale('en');
			service.setFallbackLocale('ru');

			expect(service.trans('home')).to.be.equal('Главная');
		});

		it('Should use default fallback locale (en)', function() {
			var service = new Service();

			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			service.setLocale('ru');
			expect(service.trans('home')).to.be.equal('Home');
		});

		it('Should use fallback locale when locale is not specified', function() {
			var service = new Service();

			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});
	});
});
