### Basic usage

Plugin object is available from `i18n` service as `i18n.time`.

For most cases basic formats provided by `getFullTime`, `getShortTime`, `getFullDate`, `getShortDate`, `getFullDateTime` and `getShortDateTime` should suffice.
These take a single argument: `Date` object.

#### Examples

```JavaScript
i18n.setLocale('en-US');
i18n.time.getFullTime(new Date());    // 1:30:54 pm

i18n.setLocale('ru');
i18n.time.getFullTime(new Date());    // 13:30:54
```

```JavaScript
i18n.setLocale('en-US');
i18n.time.getShortDate(new Date());    // 12/20/86

i18n.setLocale('ru');
i18n.time.getShortDate(new Date());    // 20.12.86
```

`getTime` and `getDate` provide more options accepting `zb.i18n.datetime.Form` (one of `LONG`, `FULL`, `MEDIUM` or `SHORT`). See below for list of formats.

`getDateTime` accepts three `zb.i18n.datetime.Form`: One that defines the manner of combination of date and time and one for date and time formats each.

#### Formatting

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

#### Examples

```JavaScript
const date = new Date('Sat Nov 22 1963 13:30:00 GMT-0600 (CST)');

i18n.time.format(date, 'hh:mm:ss a');   // "01:30:00 am"
i18n.time.format(date, 'EEEE H:mm:ss'); // "Saturday 1:30:00" (en-US locale)
i18n.time.format(date, 'EEEE H:mm:ss'); // "суббота 1:30:00" (ru locale)
i18n.time.format(date, 'MMMM d \'approximately at\' HH \'hours\''); // "November 23 approximately at 01 hours"
```

### Predefined formats examples

#### Date

| name           | en-US                    | ru                         |
|----------------|--------------------------|----------------------------|
| `FULL`         | Thursday, April 14, 2016 | четверг, 14 апреля 2016 г. |
| `LONG`         | April 14, 2016           | 14 апреля 2016 г.          |
| `MEDIUM`       | Apr 14, 2016             | 14 апр. 2016 г.            |
| `SHORT`        | 4/14/16                  | 14.04.16                   |

#### Time

| name     | en-US      | ru       |
|----------|------------|----------|
| `FULL`   | 7:20:22 pm | 19:20:22 |
| `LONG`   | 7:20:22 pm | 19:20:22 |
| `MEDIUM` | 7:20:22 pm | 19:20:22 |
| `SHORT`  | 7:21 pm    | 19:20    |

Note that time zones are currently not implemented and will result in empty strings. For this reason `FULL`, `LONG` and in most cases `MEDIUM` return the same result.
