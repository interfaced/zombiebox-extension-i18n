# Change log

## 2.1.0 (release date: 23.01.2020)

* Actualise dependencies, most notably:
  * ZombieBox to 2.5.0
  * CLDR dataset to 35 

## 2.0.0 (release date: 13.06.2019)

* Support ZombieBox 2.0

## 2.0.0-alpha.2 (release date: 23.05.2019)

* Support ZombieBox alpha.8 (implement AbstractExtension)
* Drop support for Node 8

## 2.0.0-alpha.1 (release date: 13.02.2019)

Extension code migrated to ECMAScript modules.

## 1.0.0 (release date: 01.02.2019)

* [Improvement] Updates for ZombieBox 1.0 compatibility

## 0.6.0 (release date: 22.01.2019)

* [Improvement] Updated CLDR packages to `v34`.
* [Bugfix] Fixed the bug that may lead to an invalid formatting of dates and numbers in compiled mode.

## 0.5.0 (release date: 07.08.2018)

* [Improvement] Documentation for relative formatting.
* [Improvement] Updated CLDR packages to `v33`.
* [Bugfix] Fixed ISO week number getting.

## 0.5.0-beta.2 (release date: 13.04.2018)

* [Bugfix] Fixed Closure Compiler warnings.

## 0.5.0-beta.1 (release date: 12.04.2018)

* [Feature] Relative formatting of dates.
* [Bugfix] Fixed CLDR packages path resolving.

## 0.4.0-beta.1 (release date: 01.02.2018)

* [Feature] Introduced plugins system.
* [Feature] Auto generation from CLDR locale data.
* [Improvement] Code source moved to ES6.
* [Improvement] Deprecated `i18n.setPluralFormsSeparator` in favour of `i18n.pluralization.setPluralFormsSeparator`.
* [Improvement] Deprecated `i18n.setPluralValueStub` in favour of `i18n.pluralization.setPluralValueStub`.
* [Improvement] Updated CLDR packages to `v32`.

## 0.3.1 (release date: 09.06.2016)

* [Bugfix] Fix installation as dependency of another package.

## 0.3.0 (release date: 08.06.2016)

* [Feature] Added numbers and currencies formatting.
* [Improvement] Any numbers supplied to `i18n.trans` will get automatically formatted.
* [Improvement] Pluralization will no longer work with numeric values provided as strings, use numbers instead.

## 0.2.0 (release date: 01.06.2016)

* [Feature] Added time formatting via `i18n.time` interface.
* [Improvement] Added a warning when translating a token fails.
* [Improvement] Implemented locale narrowing from more specific to less specific when more specific are not supported.
* [Bugfix] Fixed float number parsing in pluralization module.

## 0.1.3 (release date: 18.04.2016)

* [Bugfix] Removed trailing comas from some cardinal forms to avoid compilation errors.

## 0.1.2 (release date: 15.03.2016)

* [Improvement] Added convention about naming of pack keys.
* [Bugfix] Fixed bug when pluralization and interpolation are in the same time.
* [Bugfix] Fixed minor mistakes in the readme file.

## 0.1.1 (release date: 10.03.2016)

* [Improvement] Now packs that were added last have higher priority.
* [Bugfix] Fixed mistakes in the readme file.

## 0.1.0 (release date: 01.03.2016)

* Initial release.
