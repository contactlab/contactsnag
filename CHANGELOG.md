# Changelog

## [6.0.1](https://github.com/contactlab/gluex/releases/tag/v6.0.1)

**Dependencies:**

- Bump `@bugsnag/js` from 6.4.0 to 6.4.1 (#162)
- Bump `read-pkg-up` from 6.0.0 to 7.0.0 (#161)

## [6.0.0](https://github.com/contactlab/gluex/releases/tag/v6.0.0)

**Breaking:**

- `[dependencies][documentation]` Move to fp-ts version 2.x (#158)

## [5.0.1](https://github.com/contactlab/gluex/releases/tag/v5.0.1)

**Dependencies:**

- Bump [`@bugsnag/js`](https://github.com/bugsnag/bugsnag-js) from 6.3.2 to 6.4.0 (#142)

## [5.0.0](https://github.com/contactlab/gluex/releases/tag/v5.0.0)

**Breaking:**

- `[documentation]` RTFM: setOptions is useless (#136)

## [4.0.1](https://github.com/contactlab/gluex/releases/tag/v4.0.1)

**Bug:**

- `[internal]` Fix set options validation (#134)

## [4.0.0](https://github.com/contactlab/gluex/releases/tag/v4.0.0)

**Breaking:**

- `[bug]` Wrong API, should be rewritten (#128) - check [README.md](README.md) for further information

## [3.0.1](https://github.com/contactlab/gluex/releases/tag/v3.0.1)

**Dependencies:**

- `[feature]` Add and expose webpack plugin typings (#126)

## [3.0.0](https://github.com/contactlab/gluex/releases/tag/v3.0.0)

**Feature:**

- `[breaking]` Connect to Bugsnag cloud app (#105)
- `[dependencies][documentation]` Add Bugsnag build reporter (#28)
- `[dependencies][documentation]` Expose Bugsnag webpack plugin (#115)
- `[breaking]` CLI upload as proxy to bugsnag-sourcemap package (#114)
- `[documentation]` `apiKey` in setOptions() should not be required (#117)

**Dependencies:**

- upgrade ts to version 3.5.3 (#106)

## [2.0.2](https://github.com/contactlab/gluex/releases/tag/v2.0.2)

**Dependencies:**

- `[internal]` update io-ts to version 1.8.5 (#43)

## [2.0.1](https://github.com/contactlab/gluex/releases/tag/v2.0.1)

**Feature:**

- export types for configurations (#36)

## [2.0.0](https://github.com/contactlab/gluex/releases/tag/v2.0.0)

**Feature:**

- `[breaking][internal]`Move to Typescript (#27)
- `[breaking]` Bugsnag new api and lazy initialization (#26)
- `[breaking][documentation]` Rewrite source map uploader (#31)

## [1.3.1](https://github.com/contactlab/gluex/releases/tag/v1.3.1)

**Bug fix:**

- `index.js` in `package.json`'s files field (shipped with package when publish on npm)

## [1.3.0](https://github.com/contactlab/gluex/releases/tag/v1.3.0)

**Internal:**

- `[polish]` Publish transpiled code for test purposes (#23)

## [1.2.1](https://github.com/contactlab/gluex/releases/tag/v1.2.1)

**Bug fix:**

- Babel preset bug (#21)

## [1.2.0](https://github.com/contactlab/gluex/releases/tag/v1.2.0)

**Internal:**

- Add tests (#3)
- Update bugsnag version (#4)
- Check Bugsnag configurations (#5)
- Use promises in upload script (#6)
- Lock master branch (#7)
- dotfiles (#9)
- eslint (#11)
- Travis integration (#13)
- Publish only necessary files/dirs (#17)

## [1.1.0](https://github.com/contactlab/gluex/releases/tag/v1.1.0)

**Feature:**

- paths for sourceMap and minifiedFile can now be set via the package.json bugsnag's object

**Internal:**

- Upgraded dependencies and fixed version number

## [1.0.0](https://github.com/contactlab/gluex/releases/tag/v1.0.0)

First release
