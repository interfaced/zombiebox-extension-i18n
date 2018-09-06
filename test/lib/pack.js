goog.require('zb.i18n.Pack');

describe('zb.i18n.Pack', () => {
	const Pack = zb.i18n.Pack;

	/**
	 * @return {zb.i18n.Pack.Map}
	 */
	function createMap() {
		return {
			'player.button.pause': 'Pause',
			'home': {
				'title': 'Home',
				'showcase': {
					'title': 'Showcase'
				}
			}
		};
	}

	it('Should be a constructor', () => {
		let instance;
		expect(() => {
			instance = new Pack({});
		}).not.to.throw();
		expect(instance).to.be.instanceOf(Pack);
	});

	it('Should expose public methods', () => {
		const prototype = Pack.prototype;
		expect(prototype.setKeySeparator).to.be.a('function');
		expect(prototype.getValue).to.be.a('function');
		expect(prototype.forwardKeys).to.be.a('function');
	});

	describe('Method "getValue"', () => {
		it('Should found value from map by chunks', () => {
			const pack = new Pack(createMap());

			expect(pack.getValue('home.title')).to.be.equal('Home');
			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
		});

		it('Should found value from map by flat key', () => {
			const pack = new Pack(createMap());

			expect(pack.getValue('player.button.pause')).to.be.equal('Pause');
		});

		it('Should return null when value is not found', () => {
			const pack = new Pack(createMap());

			expect(pack.getValue('invalid')).to.be.a('null');
		});

		it('Should return null when found value is chunks', () => {
			const pack = new Pack(createMap());

			expect(pack.getValue('home')).to.be.a('null');
		});
	});

	describe('Method "forwardKeys"', () => {
		it('Should forward key by specified forwarding map', () => {
			const pack = new Pack(createMap());
			const forwardingMap = {
				'home.showcase.title': 'home.showcase.head'
			};

			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
			pack.forwardKeys(forwardingMap);
			expect(pack.getValue('home.showcase.head')).to.be.equal('Showcase');
		});

		it('Should delete old key', () => {
			const pack = new Pack(createMap());
			const forwardingMap = {
				'home.showcase.title': 'home.showcase.head'
			};

			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
			pack.forwardKeys(forwardingMap);
			expect(pack.getValue('home.showcase.title')).to.be.a('null');
		});
	});

	describe('Method "setKeySeparator"', () => {
		it('Should apply new separator', () => {
			const pack = new Pack(createMap());

			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
			pack.setKeySeparator('*');
			expect(pack.getValue('home.showcase.title')).to.be.a('null');
			expect(pack.getValue('home*showcase*title')).to.be.equal('Showcase');
		});
	});
});
