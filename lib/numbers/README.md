## Basic usage

Plugin object is available from `i18n` service as `i18n.numbers`.

It provides functions for number and currency formatting.

## Numbers

Number formatting is done with `formatNumber` function. It takes number as a parameter and optional precision.
It picks decimal separator and grouping separator (between thousands typically) depending on locale settings.
If precision is unspecified and number is floating point number, it will retain original number precision.

### Examples

```js
i18n.setLocale('ru-RU');
i18n.numbers.formatNumber(1000000); // "1 000 000"
i18n.numbers.formatNumber(1.222); // "1,222"
i18n.numbers.formatNumber(1.222, 2); // "1,22"
i18n.numbers.formatNumber(1, 2); // "1,00"
```

```js
i18n.setLocale('en-US');
i18n.numbers.formatNumber(1000000); // "1,000,000"
i18n.numbers.formatNumber(1.222); // "1.222"
i18n.numbers.formatNumber(1.222, 2); // "1.22"
i18n.numbers.formatNumber(1, 2); // "1.00"
```

## Currencies

Currency formatting is done with `formatCurrency` function. It takes two mandatory arguments: value and currency identifier (a `string`) and two optional: `boolean` flag denoting whether to include fractional part or not and currency symbol type `CurrencySymbolType` (either `FULL` or `NARROW`).

If the third argument (`opt_fractional`) is true, resulting string will always include two symbols after radix separator regardless if the value was integer or not.
If it is false or not supplied, it will never contain fractional part regardless of type of the value likewise.

### Currency symbols

There are two possible types of currency symbols: *Narrow* and *Full*

*Narrow* is the default go-to symbol for the currency, but it may be ambiguous for similar currencies used in different countries.
For example Norwegian, Danish and Swedish *krona* or US, Canadian and Australian *dollar*.

*Full* symbol resolves this ambiguity by specifying the currency outside of its native locale. I.e. Australian *dollar* in US locale will be `A$`, but still `$` in AU locale.

*Narrow* should be used when context supplies enough information on what country's currency is displayed and *Full* should be used for displaying foreign currencies.

Some locales for some currencies may have both, only one or even neither. If *Narrow* symbol is not supported, *Full* will be used instead. If *Full* is not supported, currency name will be returned.

See [CLDR article](http://cldr.unicode.org/translation/currency-names) for more details.

Note that currency symbols are often not widely available Unicode symbols.

```js
import {CurrencySymbolType} from 'i18n/numbers/types';

i18n.setLocale('ru-RU');
i18n.numbers.formatCurrency(1000000, 'RUB'); // "1 000 000 ₽"
i18n.numbers.formatCurrency(1000000, 'USD'); // "1 000 000 $"

i18n.setLocale('en-US');
i18n.numbers.formatCurrency(1000000, 'RUB'); // "₽1,000,000"
i18n.numbers.formatCurrency(1000000, 'USD'); // "$1,000,000"
```

```js
i18n.setLocale('ru-RU');
i18n.numbers.formatCurrency(100, 'RUB', true); // "100,00 ₽"
i18n.numbers.formatCurrency(100.50, 'RUB'); // "100 ₽"
i18n.numbers.formatCurrency(100.50, 'RUB', true); // "100,50 ₽"
```

```js
i18n.setLocale('en-US');
i18n.numbers.formatCurrency(100.50, 'USD', true); // "$100.00"
i18n.numbers.formatCurrency(100.50, 'AUD', true); // "$100.00"

i18n.numbers.formatCurrency(100.50, 'USD', true, CurrencySymbolType.FULL); // "$100.00"
i18n.numbers.formatCurrency(100.50, 'AUD', true, CurrencySymbolType.FULL); // "$A100.00"
```
