import Pack from 'i18n/pack';
import Service from 'i18n/service';

describe('Service', () => {
	it('Should be a constructor', () => {
		let instance;
		expect(() => {
			instance = new Service();
		}).not.to.throw();
		expect(instance).to.be.instanceOf(Service);
	});

	it('Should expose public methods', () => {
		const prototype = Service.prototype;
		expect(prototype.setLocale).to.be.a('function');
		expect(prototype.setFallbackLocale).to.be.a('function');
		expect(prototype.isLocaleSupported).to.be.a('function');
		expect(prototype.addPack).to.be.a('function');
		expect(prototype.trans).to.be.a('function');
	});

	it('Method "hasKey" should provide valid logic', () => {
		const service = new Service();

		service.addPack('en-US', new Pack({
			'home': 'Home'
		}));

		service.setLocale('en-US');
		expect(service.hasKey('home')).to.be.true;
		expect(service.hasKey('non-existent')).to.be.false;
	});

	describe('Method "trans"', () => {
		it('Should translate existing key', () => {
			const service = new Service();

			service.setLocale('en-US');
			service.addPack('en-US', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});

		it('Should return key itself when it is not translatable and produce warning', () => {
			const service = new Service();

			service.setLocale('ru');
			service.addPack('ru', new Pack({}));

			expect(service.trans('home')).to.be.equal('home');
		});

		it('Should give higher priority for packs, that were added last', () => {
			const service = new Service();

			service.addPack('en-US', new Pack({
				'home': 'HOME'
			}));

			service.addPack('en-US', new Pack({
				'home': 'Home'
			}));

			service.setLocale('en-US');
			expect(service.trans('home')).to.be.equal('Home');
		});

		describe('Interpolation', () => {
			it('Should interpolate value', () => {
				const service = new Service();

				service.addPack('en-US', new Pack({
					'home': 'Home of [entity]'
				}));

				service.setLocale('en-US');
				expect(service.trans('home', {
					'entity': 'the Brave'
				})).to.be.equal('Home of the Brave');
			});

			it('Should interpolate multiple values', () => {
				const service = new Service();

				service.addPack('en-US', new Pack({
					'home': 'Home of [entity] [entity]'
				}));

				service.setLocale('en-US');
				expect(service.trans('home', {
					'entity': 'the Brave'
				})).to.be.equal('Home of the Brave the Brave');
			});

			it('Should not interpolate value without right context', () => {
				const service = new Service();

				service.setLocale('en-US');
				service.addPack('en-US', new Pack({
					'home': 'Home of [entity]'
				}));

				expect(service.trans('home')).to.be.equal('Home of [entity]');
			});
		});

		describe('Pluralization', () => {
			it('Should pluralize value', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 0})).to.be.equal('0 просмотров');
				expect(service.trans('views_plural', {views: 1})).to.be.equal('1 просмотр');
				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 просмотра');
				expect(service.trans('views_plural', {views: 1.5})).to.be.equal('1,5 просмотра');
			});

			it('Should pluralize multiple values', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра] ' +
						'[viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 0})).to.be.equal('0 просмотров просмотров');
			});

			it('Should pluralize several different values', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра] ' +
					'[users] [usersPlural:пользователь|пользователя|пользователей|пользователя]'
				}));

				expect(service.trans('views_plural', {views: 3, users: 7})).to.be.equal('3 просмотра 7 пользователей');
			});

			it('Should not pluralize value without right context', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural'))
					.to.be.equal('[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]');
			});

			it('Should pluralize and interpolate in the same time', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра] [period]'
				}));

				expect(service.trans('views_plural', {
					'views': 10,
					'period': 'за сегодня'
				})).to.be.equal('10 просмотров за сегодня');
			});

			it('Should handle float values in context', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 1.5})).to.be.equal('1,5 просмотра');
			});

			it('Should stub value when locale is invalid', () => {
				const service = new Service();

				service.setLocale('invalid');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра] ' +
					'[users] [usersPlural:пользователь|пользователя|пользователей|пользователя]'
				}));

				expect(service.trans('views_plural', {views: 3, users: 7})).to.be.equal('3 ??? 7 ???');
			});

			it('Should stub value when context is invalid', () => {
				const service = new Service();

				service.setLocale('ru');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр*просмотра*просмотров*просмотра] ' +
					'[users] [usersPlural:пользователь|пользователя|пользователей|пользователя]'
				}));

				expect(service.trans('views_plural', {views: 3, users: 7})).to.be.equal('3 ??? 7 пользователей');
			});

			it('Should stub value when there is no suitable form', () => {
				const service = new Service();

				service.setLocale('invalid');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр]'
				}));

				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 ???');
			});

			it('Method "pluralization.setFormsSeparator" should provide valid logic', () => {
				const service = new Service();

				service.setLocale('ru');
				service.pluralization.setFormsSeparator('*');
				service.addPack('ru', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр*просмотра*просмотров*просмотра]'
				}));

				expect(service.trans('views_plural', {views: 0})).to.be.equal('0 просмотров');
				expect(service.trans('views_plural', {views: 1})).to.be.equal('1 просмотр');
				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 просмотра');
				expect(service.trans('views_plural', {views: 1.5})).to.be.equal('1,5 просмотра');
			});

			it('Method "pluralization.setValueStub" should provide valid logic', () => {
				const service = new Service();

				service.setLocale('invalid');
				service.pluralization.setValueStub('***');
				service.addPack('invalid', new Pack({
					'views_plural': '[views] [viewsPlural:просмотр|просмотра|просмотров|просмотра]'
				}));

				expect(service.trans('views_plural', {views: 2})).to.be.equal('2 ***');
			});
		});
	});

	describe('Method "addPack"', () => {
		it('Should add new pack', () => {
			const service = new Service();

			service.setLocale('en-US');
			service.addPack('en-US', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});

		it('Should not add already added pack', () => {
			const service = new Service();
			const pack = new Pack({});

			service.addPack('en-US', pack);
			expect(() => {
				service.addPack('en-US', pack);
			}).to.throw();

			expect(() => {
				service.addPack('ru-RU', pack);
			}).not.to.throw();
		});
	});

	describe('Method "setLocale"', () => {
		it('Should use specified locale', () => {
			const service = new Service();

			service.addPack('en-US', new Pack({
				'home': 'Home'
			}));

			service.addPack('ru', new Pack({
				'home': 'Главная'
			}));

			service.setLocale('en-US');
			expect(service.trans('home')).to.be.equal('Home');

			service.setLocale('ru');
			expect(service.trans('home')).to.be.equal('Главная');
		});
	});

	describe('Method "setFallbackLocale"', () => {
		it('Should use specified locale as fallback', () => {
			const service = new Service();

			service.addPack('en-US', new Pack({}));
			service.addPack('ru', new Pack({
				'home': 'Главная'
			}));

			service.setLocale('en-US');
			service.setFallbackLocale('ru');

			expect(service.trans('home')).to.be.equal('Главная');
		});

		it('Should use default fallback locale (en)', () => {
			const service = new Service();

			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			service.setLocale('ru');
			expect(service.trans('home')).to.be.equal('Home');
		});

		it('Should use fallback locale when locale is not specified', () => {
			const service = new Service();

			service.addPack('en', new Pack({
				'home': 'Home'
			}));

			expect(service.trans('home')).to.be.equal('Home');
		});
	});
});
