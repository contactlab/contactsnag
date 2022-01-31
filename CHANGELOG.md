# Changelog

## [8.0.4](https://github.com/contactlab/gluex/releases/tag/v8.0.4)

**Dependencies:**

Bump @bugsnag/js from 7.13.2 to 7.16.0 (#507, #511, #540, #543)

## [8.0.3](https://github.com/contactlab/gluex/releases/tag/v8.0.3)

**Dependencies:**

- Bump @bugsnag/js from 7.11.0 to 7.13.2 (#493)
- [Security] Bump ansi-regex from 5.0.0 to 5.0.1 (#483)

## [8.0.2](https://github.com/contactlab/gluex/releases/tag/v8.0.2)

**Dependencies:**

- [Security] Bump path-parse from 1.0.6 to 1.0.7 (#462)
- Bump @bugsnag/js from 7.5.4 to 7.11.0 (#351, #353, #371, #378, #389, #397, #421, #427, #444, #449, #459)
- Bump webpack-bugsnag-plugins from 1.7.0 to 1.8.0 (#448)
- [Security] Bump glob-parent from 5.1.1 to 5.1.2 (#433)
- [Security] Bump ws from 7.4.2 to 7.4.6 (#424)
- [Security] Bump hosted-git-info from 2.8.8 to 2.8.9 (#416)
- [Security] Bump lodash from 4.17.20 to 4.17.21 (#409)

## [8.0.1](https://github.com/contactlab/gluex/releases/tag/v8.0.1)

**Bug fix:**

- fix husky install on postinstall (#348)

## [8.0.0](https://github.com/contactlab/gluex/releases/tag/v8.0.0)

**Breaking:**

- `[dependencies][documentation]` Remove uploader and reporter CLI commands (#344)
- `[dependencies]` fp-ts and io-ts as peer dependencies (#342)

**Dependencies:**

- Upgrade webpack-bugsnag-plugins to support Webpack 5 (#341)
- Bump @bugsnag/js from 7.0.0 to 7.5.4 (#331, #322, #318, #316, #309, #305, #301, #296, #288, #287, #279, #334)
- [Security] Bump ini from 1.3.5 to 1.3.7 (#332)

## [7.0.0](https://github.com/contactlab/gluex/releases/tag/v7.0.0)

**Breaking:**

- `[dependencies]` Upgrade Bugsnag to version 7.0.0 (#272)

## [6.1.0](https://github.com/contactlab/gluex/releases/tag/v6.1.0)

**Internal:**

- Drop support for Nodejs v8.x

**Dependencies:**

- Bump bugsnag-sourcemaps from 1.2.2 to 1.3.0 (#263)
- Bump chalk from 3.0.0 to 4.0.0 (#261)
- remove Node v8 from CI
- [Security] Bump acorn from 6.4.0 to 6.4.1 (#255)
- Switch to eslint (#252)
- Bump @bugsnag/js from 6.5.0 to 6.5.2 (#241)
- use range version for dev dependencies (#240)

## [6.0.5](https://github.com/contactlab/gluex/releases/tag/v6.0.5)

**Internal:**

- use caret range for `tslib`

## [6.0.4](https://github.com/contactlab/gluex/releases/tag/v6.0.4)

**Dependencies:**

- Bump `@bugsnag/js` from 6.4.3 to 6.5.0 (#207)
- [Security] Bump `handlebars` from 4.1.2 to 4.5.3 (#211)
- Bump `read-pkg-up` from 7.0.0 to 7.0.1 (#203)
- Bump `chalk` from 2.4.2 to 3.0.0 (#191)

## [6.0.3](https://github.com/contactlab/gluex/releases/tag/v6.0.3)

**Dependencies:**

- Bump `@bugsnag/js` from 6.4.2 to 6.4.3 (#180)
- Bump `bugsnag-sourcemaps` from 1.2.1 to 1.2.2 (#182)
- Bump `fp-ts` from 2.1.0 to 2.1.1 (#177)
- Bump `@types/jest` from 24.0.18 to 24.0.21 (#183 - #179 - #176)
- Bump `@types/node` from 12.7.12 to 12.12.5 (#181 - #178 - #175)

## [6.0.2](https://github.com/contactlab/gluex/releases/tag/v6.0.2)

**Dependencies:**

- Bump `@bugsnag/js` from 6.4.1 to 6.4.2 (#170)
- Bump `typescript` from 3.6.3 to 3.6.4 (#171)

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

**Bug fix:**

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
