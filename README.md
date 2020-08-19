# ContactSnag

![Node CI](https://github.com/contactlab/contactsnag/workflows/Node%20CI/badge.svg)

> [Bugsnag](https://docs.bugsnag.com/platforms/javascript/) utilities for Contactlab's applications.

This package embeds 4 main functionalities:

- **Javascript wrapper for Bugsnag**: importing `ContactSnag` in your code gives you access to a "lazy" and "side-effect aware" Bugsnag client that exposes the same APIs of the original SDK.
- **CLI sourcemap uploader**: calling `contactsnag upload` from the command line it will upload your bundle's sourcemap to the Bugsnag dashboard (using the Bugsnag API endpoint) for better error debugging.
- **CLI build reporter**: calling `contactsnag report` from the command line it will report the current build to enable source code linking from Bugsnag dashboard.
- **Webpack plugin**: ContactSnag exposes (as dependecy) the [`webpack-bugsnag-plugins`](https://github.com/bugsnag/webpack-bugsnag-plugins) in order to upload sourcemaps and report builds using Webpack (take a look [here](https://docs.bugsnag.com/build-integrations/webpack/#configuration) for available configuration).

It is fully written in [Typescript](https://www.typescriptlang.org/docs/home.html) (version >= 3.3.3) and extensively uses [`fp-ts` library](https://github.com/gcanti/fp-ts).

## Installation

Get the latest version from NPM registry:

```sh
$ npm install contactsnag --save

# -- or --

$ yarn add contactsnag
```

## ContactSnag Client

The package exposes a single `ContactSnag` function.

This receives a configuration object and returns a ContactSnag client:

```ts
declare function ContactSnag(conf: Config): Client;
```

[`Config`](src/validate.ts) is a kind of subset of [Bugsnag's configuration options](https://docs.bugsnag.com/platforms/javascript/configuration-options/) with some differences:

- `appVersion`, `enabledReleaseStages`, and `releaseStage` are required properties;
- `endpoints` and `enabledBreadcrumbTypes` cannot be set/overwritten.

[`Client`](src/client.ts) is a custom data structure which embeds some `Bugsnag.Client` features, guarantees a lazy initialization and that an error is raised if a wrong configuration is passed.

```ts
interface Client {
  readonly client: () => ActualClient;

  readonly start: () => void;

  readonly notify: (
    error: Bugsnag.NotifiableError,
    onError?: Bugsnag.OnErrorCallback
  ) => IOEither<Error, void>;

  readonly setUser: (user: Bugsnag.User) => IOEither<Error, void>;
}
```

The `ActualClient` type encodes the three different states of the ContactSnag client:

```ts
type ActualClient = ConfigError | Still | Started;
```

`ConfigError` represents a not valid configuration provided to the client's creation function:

```ts
interface ConfigError {
  readonly type: 'ConfigError';
  readonly error: Error;
}
```

`Still` represents a not started client:

```ts
interface Still {
  readonly type: 'Still';
  readonly config: Config;
}
```

`Started` represents a started client:

```ts
interface Started {
  readonly type: 'Started';
  readonly bugsnag: Bugsnag.Client;
}
```

Each time a `Client`'s method is called, it will internally check (a.k.a. _fold_) the current state and execute an operation.

### `client()`

Returns the current `ActualClient`.

### `start()`

Starts the client if it's in the `Still` state, otherwise it does nothing.

### `notify()`

Returns a `void` effectful operation that can fail (`IOEither`).

When the `IO` is ran:

- if the client is in the `Started` state, it will notify an error to Bugsnag or will fail if the Bugsnag client raises an exception;
- if the client is in the `ConfigError` state, it will return a `Left<Error>` (_"configuration error"_);
- if the client is in the `Still` state, it will return a `Left<Error>` (_"not yet started error"_).

#### Usage example

Notify Bugsnag with a custom error message:

```ts
import {ContactSnag} from 'contactsnag';

const client = ContactSnag({
  apiKey: 'TEST-API-KEY',
  appVersion: '1.2.3',
  enabledReleaseStages: ['production'],
  releaseStage: 'production'
});

// Set notification on button click
document.getElementById('btn').addEventListener('click', () =>
  client.notify(new Error('Custom error message'), event => {
    event.addMetadata('custom', 'errname', 'My error name');
  })()
);

// Start Bugsnag
client.start();
```

### `setUser()`

Returns a `void` effectful operation that can fail (`IOEither`).

When the `IO` is ran:

- if the client is in the `Started` state, it will set the provided user on the Bugsnag client;
- if the client is in the `ConfigError` state, it will return a `Left<Error>` (_"configuration error"_);
- if the client is in the `Still` state, it will return a `Left<Error>` (_"not yet started error"_).

#### Usage example

Set a user for the entire session:

```ts
import {ContactSnag} from 'contactsnag';

const client = ContactSnag({
  apiKey: 'TEST-API-KEY',
  appVersion: '1.2.3',
  enabledReleaseStages: ['production'],
  releaseStage: 'production'
});

// Start Bugsnag
client.start();

// Set user after 1 second
setTimeout(() => {
  client.setUser({id: '1'})();
}, 1000);
```

## CLI

Add a `bugsnag/apiKey` field in the root `package.json` of your application and set your Bugsnag API key:

```json
{
  "bugsnag": {
    "apiKey": "my-project-api-key"
  }
}
```

This is the only required option. `app-version` is automatically taken from `package.json`

### Uploader

You can then set any [`bugsnag-sourcemap` option](https://docs.bugsnag.com/build-integrations/js/#source-map-uploader) (`overwrite` is set to `true` by default) when run the uploader from the [command line](https://docs.bugsnag.com/build-integrations/js/#cli-source-maps):

```sh
$ npx contactsnag upload \
  --minified-url 'http://example.com/assets/example.min.js' \
  --source-map path/to/example.js.map \
  --minified-file path/to/example.min.js

# --- or ---

$ yarn contactsnag upload \
  --minified-url 'http://example.com/assets/example.min.js' \
  --source-map path/to/example.js.map \
  --minified-file path/to/example.min.js
```

or through a script in `package.json` file:

```json
{
  "scripts": {
    "csnag:upload": "contactsnag upload --minified-url 'http://example.com/assets/example.min.js' --source-map path/to/example.js.map --minified-file path/to/example.min.js"
  }
}
```

### Reporter

You can then set any [`bugsnag-build-reporter` option](https://docs.bugsnag.com/build-integrations/js/#build-reporter) (`release-stage` is set to `production` by default) when run the reporter from the [command line](https://docs.bugsnag.com/build-integrations/js/#cli-build-reporter):

```sh
$ npx contactsnag report \
  --builder-name user.name \
  --source-control-revision ABCDEFGH1234567

# --- or ---

$ yarn contactsnag report \
  --builder-name user.name \
  --source-control-revision ABCDEFGH1234567
```

or through a script in `package.json` file:

```json
{
  "scripts": {
    "csnag:report": "contactsnag report --builder-name user.name --source-control-revision ABCDEFGH1234567"
  }
}
```

## Contributing

Opening issues is always welcome.

Then, fork the repository or create a new branch, write your code and send a pull request.

This project uses [Prettier](https://prettier.io/) (automatically applied as pre-commit hook), [ESLint](https://eslint.org/) (with [TypeScript integration](https://github.com/typescript-eslint/typescript-eslint)) and [Jest](https://facebook.github.io/jest/en/).

Tests are run with:

```sh
$ npm test
```

## License

[Apache 2.0](LICENSE).
