describe('zb.i18n.Pack', function() {
	var Pack = zb.i18n.Pack;

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

	it('Should be a constructor', function() {
		var instance;
		expect(function() {
			instance = new Pack({});
		}).not.to.throw();
		expect(instance).to.be.instanceOf(Pack);
	});

	it('Should expose public methods', function() {
		var prototype = Pack.prototype;
		expect(prototype.setKeySeparator).to.be.a('function');
		expect(prototype.getValue).to.be.a('function');
		expect(prototype.forwardKeys).to.be.a('function');
	});

	describe('Method "getValue"', function() {
		it('Should found value from map by chunks', function() {
			var pack = new Pack(createMap());

			expect(pack.getValue('home.title')).to.be.equal('Home');
			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
		});

		it('Should found value from map by flat key', function() {
			var pack = new Pack(createMap());

			expect(pack.getValue('player.button.pause')).to.be.equal('Pause');
		});

		it('Should return null when value is not found', function() {
			var pack = new Pack(createMap());

			expect(pack.getValue('invalid')).to.be.a('null');
		});

		it('Should return null when found value is chunks', function() {
			var pack = new Pack(createMap());

			expect(pack.getValue('home')).to.be.a('null');
		});
	});

	describe('Method "forwardKeys"', function() {
		it('Should forward key by specified forwarding map', function() {
			var pack = new Pack(createMap());
			var forwardingMap = {
				'home.showcase.title': 'home.showcase.head'
			};

			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
			pack.forwardKeys(forwardingMap);
			expect(pack.getValue('home.showcase.head')).to.be.equal('Showcase');
		});

		it('Should delete old key', function() {
			var pack = new Pack(createMap());
			var forwardingMap = {
				'home.showcase.title': 'home.showcase.head'
			};

			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
			pack.forwardKeys(forwardingMap);
			expect(pack.getValue('home.showcase.title')).to.be.a('null');
		});
	});

	describe('Method "setKeySeparator"', function() {
		it('Should apply new separator', function() {
			var pack = new Pack(createMap());

			expect(pack.getValue('home.showcase.title')).to.be.equal('Showcase');
			pack.setKeySeparator('*');
			expect(pack.getValue('home.showcase.title')).to.be.a('null');
			expect(pack.getValue('home*showcase*title')).to.be.equal('Showcase');
		});
	});
});
