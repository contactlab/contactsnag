# contactsnag

[![Build Status](https://clab-dev.visualstudio.com/OSS/_apis/build/status/contactlab.contactsnag?branchName=master)](https://clab-dev.visualstudio.com/OSS/_build/latest?definitionId=33&branchName=master)

> [Bugsnag](https://docs.bugsnag.com/platforms/javascript/) utilities for Contactlab's applications.

This package embeds 3 main functionalities:

- **Javascript wrapper for Bugsnag**: importing `ContactSnag` in your code gives you access to a "lazy" and "side-effect aware" Bugsnag client that exposes the same APIs of the original SDK.
- **CLI sourcemap uploader**: calling `contactsnag upload` from the command line it will upload your bundle's sourcemap to the Bugsnag dashboard (using the Bugsnag API endpoint) for better error debugging.
- **CLI build reporter**: calling `contactsnag report` from the command line it will report the current build to enable source code linking from Bugsnag dashboard.

It is fully written in [Typescript](https://www.typescriptlang.org/docs/home.html) (version >= 3.3.3) and extensively uses [`fp-ts` library](https://github.com/gcanti/fp-ts).

## Installation

Get the latest version from NPM registry:

```sh
$ npm install contactsnag --save

# -- or --

$ yarn add contactsnag
```

## SDK

The package exposes a couple of function.

### `ContactSnag`

Receives a configuration object and returns a client:

```ts
declare function ContactSnag(conf: Config): Client;
```

[`Config`](src/index.ts) is a kind of subset of [Bugsnag's configuration options](https://docs.bugsnag.com/platforms/javascript/configuration-options/) which some differences:

- `appVersion`, `notifyReleaseStages`, and `releaseStage` are required properties;
- `endpoints` and `consoleBreadcrumbsEnabled` cannot be set/overwritten.

[`Client`](src/index.ts) is a `IOEither<Error, Bugsnag.Client>` which guarantees a lazy initialization and that an error is raised if a wrong configuration is passed.

### `notify`

Receives a client, a notifiable error and an optional configuration object and returns a `void` effectful operation:

```ts
declare function notify(
  client: Client,
  error: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): IOEither<Error, void>;
```

This is lazy and prevents that your program/application would crash if the underlying Bugsnag's `notify()` method throwns an error.

### `setOptions`

Receives a client and a configuration object and return a `void` effectful operation:

```ts
type AnyBugsnagConfig = Partial<Bugsnag.IConfig>;

declare function setOptions(
  client: Client,
  opts: AnyBugsnagConfig
): IOEither<Error, void>;
```

This is lazy and an error is raised if a wrong options object is passed. `opts` are merged with client's current configuration ([see](https://github.com/bugsnag/bugsnag-js/blob/master/packages/core/client.js#L63)).

#### JS usage example

Notify Bugsnag with a custom error message:

```ts
import {ContactSnag, notify} from 'contactsnag';

const client = ContactSnag({
  apiKey: 'TEST-API-KEY',
  appVersion: '1.2.3',
  notifyReleaseStages: ['production'],
  releaseStage: 'production'
});

const notification = notify(client, 'Custom error message', {
  user: {id: 1},
  metaData: {
    custom: 'My error name'
  }
});

// Set notification on button click
document
  .getElementById('btn')
  .addEventListener('click', () => notification.run());

// Start Bugsnag
client.run();
```

Set a user for the entire session:

```ts
import {ContactSnag, setOptions} from 'contactsnag';

const client = ContactSnag({
  apiKey: 'TEST-API-KEY',
  appVersion: '1.2.3',
  notifyReleaseStages: ['production'],
  releaseStage: 'production'
});

// Start Bugsnag
client.run();

// Set user after 1 second
setTimeout(() => {
  setOptions(client, {
    apiKey: 'TEST-API-KEY',
    user: {id: 1}
  }).run();
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

This project uses [Prettier](https://prettier.io/) (automatically applied as pre-commit hook), [TSLint](https://palantir.github.io/tslint/) and [Jest](https://facebook.github.io/jest/en/).

Tests are run with:

```sh
$ npm test
```

## License

[Apache 2.0](LICENSE).
