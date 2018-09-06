# zombiebox-extension-i18n

[ZombieBox](https://zombiebox.tv) extension for i18n and l10n.

# Usage

```JavaScript
goog.require('zb.i18n.Service');
goog.require('zb.i18n.Pack');

const i18n = new zb.i18n.Service();

i18n.addPack('en', new zb.i18n.Pack({
	'home': {
		'title': 'Home'
	}
}));

i18n.addPack('ru', new zb.i18n.Pack({
	'home': {
		'title': 'Главная'
	}
}));

i18n.setLocale('en');

console.log(i18n.trans('home.title')); // Output: "Home"
```

# Locales

Locales are defined by [BCP 47](https://tools.ietf.org/html/bcp47). A cleaner explanation is [available from w3c](https://www.w3.org/International/articles/language-tags/).

The extension will try to normalize any locale given to it. That is, replace `_` with `-` and reduce the tags. Try to avoid this and supply valid locales.

Examples of valid locales: `ru`, `ru-KZ`, `en`, `en-US`, `en-GB`. Use [CLDR language identifier](http://unicode.org/cldr/utility/languageid.jsp) to verify if the locales you're providing are valid.

# Plugins

- [Working with date and time](lib/datetime/README.md)
- [Working with numbers](lib/numbers/README.md)

# Features

- Fallback locale
- Interpolation
- Pluralization
- Pack keys forwarding
- Key separator customization

#### Fallback locale

By default fallback locale is `en`, but it can be changed with *setFallbackLocale* method.

```JavaScript
i18n.addPack('en', new zb.i18n.Pack({
	'home': {
		'title': 'Home'
	}
}));

i18n.addPack('ru', new zb.i18n.Pack({
	'player': 'Плеер',
	'home': {
		'title': 'Главная'
	}
}));

i18n.setFallbackLocale('ru');

console.log(i18n.trans('player')); // Output: "Плеер", because pack "en" has no key "player" and "ru" is its fallback locale.
```

#### Interpolation

```JavaScript
i18n.addPack('en', new zb.i18n.Pack({
	'video-views': 'This video was viewed [views] time(s)'
}));

console.log(i18n.trans('video-views', {views: 3})); // Output: "This video was viewed 3 time(s)"
```

Values for pluralisation should be ether `string` or `number`. Numbers will be automatically formatted (see numbers/README.md for details).
If you wish to preformat a number, supply it as a `string`.

#### Pluralization

```JavaScript
i18n.addPack('en', new zb.i18n.Pack({
	'video-views-plural': 'This video was viewed [views] [viewsPlural:time|times]'
}));

console.log(i18n.trans('video-views-plural', {views: 1})); // Output: "This video was viewed 1 time"
console.log(i18n.trans('video-views-plural', {views: 3})); // Output: "This video was viewed 3 times"
```

Plural forms separator can be customized with *pluralization.setFormsSeparator*.

```JavaScript
i18n.addPack('en', new zb.i18n.Pack({
	'video-views-plural': 'This video was viewed [views] [viewsPlural:time*times]'
}));

i18n.pluralization.setFormsSeparator('*');

console.log(i18n.trans('video-views-plural', {views: 1})); // Output: "This video was viewed 1 time"
```

When pluralization fails the value will be stubbed with string "???" by default, but it can be customized with *pluralization.setValueStub* method.

```JavaScript
i18n.addPack('en', new zb.i18n.Pack({
	'video-views-plural': 'This video was viewed [views] [viewsPlural:time]'
}));

i18n.pluralization.setValueStub('---');

console.log(i18n.trans('video-views-plural', {views: 3})); // Output: "This video was viewed 1 ---"
```

#### Pack keys forwarding

Sometimes pack keys cannot be modified (e.g. if the pack was fetched from external API). For such cases packs have method *forwardKeys* that maps keys to their new values.

```JavaScript
const enPack = new zb.i18n.Pack({
	'hom': 'Home'
});

enPack.forwardKeys({
	'hom': 'home'
});

i18n.addPack('en', enPack);

console.log(i18n.trans('home')); // Output: "Home"
```

#### Custom pack keys separator

Separator can be customized with *setKeySeparator*  method.

```JavaScript
const enPack = new zb.i18n.Pack({
	'home': {
		'title': 'Home'
	}
});

enPack.setKeySeparator(':');

i18n.addPack('en', enPack);

console.log(i18n.trans('home:title')); // Output: "Home"
```

# Conventions

- Chunks of the pack key should be separated by "-" (e.g. *'red-button-title': ...*)
- Pack variable should be named with name of the locale as prefix (e.g. *const enPack = new zb.i18n.Pack({...})*)
- Values that include raw html should be named with -html postfix (e.g. *title-html: "```My<br>Title```*")
- Values for pluralization should be named with -plural postfix (e.g. *views-plural: "[views] [viewsPlural:time|times]*")

# Running tests

```
npm run test
```
