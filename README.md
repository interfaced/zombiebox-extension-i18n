# zombiebox-extension-i18n

[ZombieBox](https://zombiebox.tv) extension for internationalization (i18n) and localization (l10n).

# Usage

The extension generates pluralization and formats data for necessary locales on the fly during build process. Provide the list of locales you want to support in projects's config file:

```js
module.exports = () => ({
	i18n: {
		locales: ['ru-RU', 'en-US']
	}
});
```

Instantiate the service and add some language packs:

```js
import Service from 'i18n/service';
import Pack from 'i18n/pack';

const enUsData = {
    'home': {
        'title': 'Home'
    }
};

const i18n = Service();
i18n.addPack('en-US', Pack(enUsData));
i18n.setLocale('en-US');

i18n.trans('home.title'); // "Home"
```

# Locales

Locales are defined by [BCP 47](https://tools.ietf.org/html/bcp47). A cleaner explanation is [available from W3C](https://www.w3.org/International/articles/language-tags/).

The extension is built upon [Unicode CLDR](http://cldr.unicode.org/) project and supports all locales available there.

# Features

- [Date and time](lib/datetime/README.md)
- [Numbers and currencies formatting](lib/numbers/README.md)
- Fallback locale
- Interpolation
- Pluralization
- Pack keys forwarding
- Custom pack keys separator

## Fallback locale

Default fallback locale is `en-US`, but it can be changed with `setFallbackLocale`.

```js
i18n.addPack('en-US', new Pack({
	'home': {
		'title': 'Home'
	}
}));

i18n.addPack('ru-RU', new Pack({
	'player': 'Плеер',
	'home': {
		'title': 'Главная'
	}
}));

i18n.setFallbackLocale('ru-RU');

i18n.trans('player'); // "Плеер", because pack en-US has no key "player" and ru-RU is its fallback locale
```

## Interpolation

```js
i18n.addPack('en-US', new zb.i18n.Pack({
	'video-views': 'This video was viewed [views] time(s)'
}));

i18n.trans('video-views', {'views': 3}); // "This video was viewed 3 time(s)"
```

Values for pluralization should be ether `string` or `number`. Numbers will be automatically formatted (see [numbers plugin documentation](numbers/README.md) for details).
If you wish to preformat a number, supply it as a `string`.

## Pluralization

```js
i18n.addPack('en-US', new zb.i18n.Pack({
	'video-views-plural': 'This video was viewed [views] [viewsPlural:time|times]'
}));

i18n.trans('video-views-plural', {'views': 1}); // "This video was viewed 1 time"
i18n.trans('video-views-plural', {'views': 3}); // "This video was viewed 3 times"
```

Plural forms separator can be customized with `pluralization.setFormsSeparator`.

```js
i18n.addPack('en-US', new zb.i18n.Pack({
	'video-views-plural': 'This video was viewed [views] [viewsPlural:time*times]'
}));

i18n.pluralization.setFormsSeparator('*');

i18n.trans('video-views-plural', {'views': 1}); // "This video was viewed 1 time"
```

When pluralization fails the value will be stubbed with string "`???`" by default, but it can be customized with `pluralization.setValueStub`.

```js
i18n.addPack('en-US', new zb.i18n.Pack({
	'video-views-plural': 'This video was viewed [views] [viewsPlural:time]'
}));

i18n.pluralization.setValueStub('---');

i18n.trans('video-views-plural', {'views': 3}); //  "This video was viewed 1 ---"
```

## Pack keys forwarding

Sometimes pack keys cannot be modified (e.g. if the pack was fetched from external API). For such cases packs have `forwardKeys` method that maps keys to their new values.

```js
const enPack = new zb.i18n.Pack({
	'hom': 'Home'
});

enPack.forwardKeys({
	'hom': 'home'
});

i18n.addPack('en-US', enPack);

i18n.trans('home'); // "Home"
```

## Custom pack keys separator

Separator can be customized with `pluralization.setKeySeparator`.

```js
const enPack = new zb.i18n.Pack({
	'home': {
		'title': 'Home'
	}
});

enPack.setKeySeparator(':');

i18n.addPack('en-US', enPack);

i18n.trans('home:title'); // "Home"
```

# Conventions

- Chunks of the pack key should be separated by "`-`" (e.g. `'red-button-title': '...'`)
- Values that include raw html should be named with `-html` postfix (e.g. `'title-html': 'My<br/>Title'`)
- Values for pluralization should be named with `-plural` postfix (e.g. `'views-plural': '[views] [viewsPlural:time|times]'`)

# Caveats

The extension sometimes makes some assumptions and simplifications about data or localisation:

 * All operations with date and time are done in local timezone. All `Date` objects and scalar time segments and intervals are treated as local. The extension will not attempt to normalize them or simulate time zones.

 * Numbers formatting always separates digits by thousands (splitting into groups of three), i.e. `10,000,000` ignoring other systems such as Indian (i.e. `1,000,00,00`).

 * Trailing zeroes are essential for number formatting in some very rare cases (i.e. `1.3` supposed to be formatted differently from `1.3000`), however since JavaScript numbers do not preserve trailing zeroes they are ignored by numbers formatting functions.

 * Internally, the extension uses its own translation system to store and retrieve various formats. It's possible to interfere with it for better or worse, but care should be taken.

 * Timezone names are not supported in time formatting.
 
Context object (the second argument of `trans` method) keys must be quoted according to the restrictions imposed by the Closure Compiler (see [Implications of global variable, function, and property renaming](https://developers.google.com/closure/compiler/docs/limitations#implications-of-global-variable-function-and-property-renaming)):

```js
i18n.trans('video-views', {views: 3}); // Bad
i18n.trans('video-views', {'views': 3}); // Good
```

Context object (the second argument of `trans` method) keys must be quoted according to the restrictions imposed by the Closure Compiler (see [Implications of global variable, function, and property renaming](https://developers.google.com/closure/compiler/docs/limitations#implications-of-global-variable-function-and-property-renaming)):

```js
i18n.trans('video-views', {views: 3}); // Bad
i18n.trans('video-views', {'views': 3}); // Good
```

# Tests

The extension has extensive unit tests coverage. 

Use `npm run test` to run them.
