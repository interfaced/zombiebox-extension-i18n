## Basic usage

Plugin object is available from `i18n` service as `i18n.time`.

For most cases basic formats provided by `getFullTime`, `getShortTime`, `getFullDate`, `getShortDate`, `getFullDateTime` and `getShortDateTime` should suffice.
These take a single argument: `Date` object.

### Examples

```js
i18n.setLocale('en-US');
i18n.time.getFullTime(new Date()); // "1:30:54 pm"

i18n.setLocale('ru-RU');
i18n.time.getFullTime(new Date()); // "13:30:54"
```

```js
i18n.setLocale('en-US');
i18n.time.getShortDate(new Date()); // "12/20/86"

i18n.setLocale('ru-RU');
i18n.time.getShortDate(new Date()); // "20.12.1986"
```

`getTime` and `getDate` provide more options accepting `zb.i18n.datetime.Form` (one of `LONG`, `FULL`, `MEDIUM` or `SHORT`). See below for list of formats.

`getDateTime` accepts three `zb.i18n.datetime.Form`: One that defines the manner of combination of date and time and one for date and time formats each.

## Formatting

`i18n.time.format` formats any string supporting a range of tokens. Note that this will ignore locales and will format date/time exactly as described in format.
Since tokens are latin alpha-numeric characters, characters that should appear in the resulting string unformatted should be enclosed with single quotes (`'`).
To print the single quote itself, put it twice (`''`).

### Formatting tokens

| token  |      description     | example (en-US) |
|--------|----------------------|-----------------|
| `s`    | Seconds              |       30        |
| `ss`   | Padded seconds       |       06        |
| `m`    | Minutes              |        2        |
| `mm`   | Padded minutes       |       02        |
| `H`    | Hours 24h            |       17        |
| `HH`   | Padded hours 24h     |       01        |
| `h`    | Hours 12h            |        3        |
| `hh`   | Padded hours 12h     |       03        |
| `a`    | Meridiem lower case  |       am        |
| `A`    | Meridiem             |       AM        |
| `d`    | Day                  |        3        |
| `dd`   | Padded day           |       01        |
| `E`    | Abbreviated day      |       Sun       |
| `EE`   | Abbreviated day      |       Sun       |
| `EEE`  | Abbreviated day      |       Sun       |
| `EEEE` | Long day of week     |     Sunday      |
| `EEEEE`| Narrow day of week   |        S        |
| `M`    | Month                |       12        |
| `MM`   | Padded month         |       04        |
| `MMM`  | Short month name     |       Nov       |
| `MMMM` | Long month name      |    November     |
| `MMMMM`| Narrow month name    |        N        |
| `y`    | Year                 |      2009       |
| `yy`   | Short year           |       09        |
| `X`    | Unix timestamp       |  1460639436627  |
| `x`    | Unix timestamp in ms | 1460639436627656|

### Examples

```js
const date = new Date('Fri Nov 22 1963 13:30:00 GMT+0700');
 
i18n.time.format(date, 'hh:mm:ss a');   // "01:30:00 am"
i18n.time.format(date, 'EEEE H:mm:ss'); // "Friday 13:30:00" (en-US locale)
i18n.time.format(date, 'EEEE H:mm:ss'); // "пятница 13:30:00" (ru-RU locale)
i18n.time.format(date, `MMMM d 'approximately at' HH 'hours'`); // "November 22 approximately at 13 hours"
```
 
### Predefined formats examples

#### Date

| name           | en-US                    | ru-RU                      |
|----------------|--------------------------|----------------------------|
| `FULL`         | Thursday, April 14, 2016 | четверг, 14 апреля 2016 г. |
| `LONG`         | April 14, 2016           | 14 апреля 2016 г.          |
| `MEDIUM`       | Apr 14, 2016             | 14 апр. 2016 г.            |
| `SHORT`        | 4/14/16                  | 14.04.2016                 |

#### Time

| name     | en-US      | ru-RU    |
|----------|------------|----------|
| `FULL`   | 7:20:22 pm | 19:20:22 |
| `LONG`   | 7:20:22 pm | 19:20:22 |
| `MEDIUM` | 7:20:22 pm | 19:20:22 |
| `SHORT`  | 7:21 pm    | 19:20    |

Note that time zones are currently not implemented and will result in empty strings. For this reason `FULL`, `LONG` and in most cases `MEDIUM` return the same result.

## Relative time

`i18n.time.relative` gives a human readable estimate on how far into the past or feature given date is, i.e. "*2 weeks ago*", "*yesterday*" or "*5 months from now*" from the current moment at the time of function call. It will select the lowest possible time unit to use.

```js
const july4th2018 = new Date(2018, 6, 4);

i18n.time.relative(july4th2018); // "5 days ago" assuming it's run on July 9th, 2018
```

Anchor date to be used instead of current moment can be supplied with the second argument.

```js
const midnightJuly4th2018 = new Date(2018, 6, 4);
const noonJuly4th2018 = new Date(2018, 6, 4, 12);

const midnightJuly5th2018 = new Date(2018, 6, 5);
const midnightJuly4th2020 = new Date(2020, 6, 5);

i18n.time.relative(midnightJuly4th2018, noonJuly4th2018); // "12 hours ago"
i18n.time.relative(midnightJuly4th2018, midnightJuly5th2018); // "yesterday"
i18n.time.relative(midnightJuly4th2018, midnightJuly4th2020); // "2 years ago"
```

### Adverbs

When possible, `app.i18n.time.relative` uses adverbs to describe time (i.e. "*yesterday*"). Availability of such adverbs differs from locale to locale, for example a number of languages have a dedicated word for *a day after tomorrow*, but others like English don't. 

The extension will automatically use such adverbs when possible. This behavior can be configured (see below).

```js
const july4th2018 = new Date(2018, 6, 4);
const july5th2018 = new Date(2018, 6, 5);
const july2nd2018 = new Date(2018, 6, 2);

i18n.setLocale('en-US');
i18n.time.relative(july4th2018, july5th2018); // "yesterday"
i18n.time.relative(july4th2018, july2nd2018); // "in 2 days" 

i18n.setLocale('ru-RU');
i18n.time.relative(july4th2018, july5th2018); // "вчера"
i18n.time.relative(july4th2018, july2nd2018); // "послезавтра" 
```

### Options

`i18n.time.relative` accepts a third argument, `zb.i18n.datetime.RelativeTimeOptions` that configures its output.

#### `useAdverbs`

Configures whether `i18n.time.relative` should use adverbs or not. `true` by default.

```js
const july4th2018 = new Date(2018, 6, 4);
const july5th2018 = new Date(2018, 6, 5);

i18n.time.relative(july4th2018, july5th2018); // "yesterday" 
i18n.time.relative(july4th2018, july5th2018, {useAdverbs: true}); // "yesterday" 
i18n.time.relative(july4th2018, july5th2018, {useAdverbs: false}); // "1 day ago" 
```

#### `minUnit` and `maxUnit`

Both are `zb.i18n.datetime.Unit`. Limit selection of units that `i18n.time.relative` will use to format time. Both limits are inclusive. If you provide the same unit for both, exactly that unit will be used. Providing `minUnit` wider than `maxUnit` will produce an exception.

```js
const july4th2018 = new Date(2018, 6, 4);
const july5th2018 = new Date(2018, 6, 5);

const {YEAR, MINUTE, SECOND} = zb.i18n.datetime.Unit;

i18n.time.relative(july4th2018, july5th2018, {minUnit: YEAR}); // "this year"
i18n.time.relative(july4th2018, july5th2018, {maxUnit: SECOND}); // "86,400 seconds ago"
i18n.time.relative(july4th2018, july5th2018, {minUnit: MINUTE, maxUnit: MINUTE}); // "1,440 minutes ago"
i18n.time.relative(july4th2018, july5th2018, {minUnit: YEAR, maxUnit: MONTH}); // Throws Error
```
