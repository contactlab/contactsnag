# contactsnag

[![Build Status](https://travis-ci.org/contactlab/contactsnag.svg?branch=master)](https://travis-ci.org/contactlab/contactsnag)

> [Bugsnag](https://docs.bugsnag.com/platforms/javascript/) utilities for Contactlab's applications.

This package embeds 2 main functionalities:

- **Javascript wrapper for Bugsnag**: importing `ContactSnag` in your frontend code gives you access to a pre-configured Bugsnag browser SDK object wrapper that exposes the same APIs of the original SDK.
- **CLI sourcemap uploader**: calling `contactsnag upload` from the command line it will upload your bundle's sourcemap to the Bugsnag dashboard (using the Bugsnag API endpoint) for better error debugging.

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
declare function ContactSnag(conf: ContactSnagConfig): ContactSnagClient;
```

[`ContactSnagConfig`](src/index.ts) is a kind of subset of [Bugsnag's configuration options](https://docs.bugsnag.com/platforms/javascript/configuration-options/) which some differences:

- `appVersion`, `notifyReleaseStages`, and `releaseStage` are required properties;
- `endpoints` and `consoleBreadcrumbsEnabled` cannot be set/overwritten.

[`ContactSnagClient`](src/index.ts) is a `IOEither<Error, Bugsnag.Client>` which guarantees a lazy initialization and that an error is raised if a wrong configuration is passed.

### `notify`

Receives a client, a notifiable error and an optional configuration object and returns a `void` effectful operation:

```ts
declare function notify(
  client: ContactSnagClient,
  error: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): IOEither<Error, void>;
```

This is lazy and prevents that your program/application would crash if the underlying Bugsnag's `notify()` method throwns an error.

### `setOptions`

Receives a client and a configuration object and return a `void` effectful operation:

```ts
declare function setOptions(
  client: ContactSnagClient,
  opts: Bugsnag.IConfig
): IOEither<Error, void>;
```

This is lazy and an error is raised if a wrong options object is passed.

## Uploader

Add a `bugsnag` node in the root `package.json` of your application to set few parameters:

```json
{
  ...
  "bugsnag": {
    "apiKey": "my-project-api-key",
    "minifiedUrl": "https://my.application.com/bundle.js",
    "sourceMap": "./local/path/to/your/bundle.js.map",
    "minifiedFile": "./local/path/to/your/bundle.js"
  }
}
```

- **apiKey**: is used in order to authenticate calls to the upload API.
- **minifiedUrl**: [docs here](https://docs.bugsnag.com/api/js-source-map-upload/#uploading-source-maps).
- **sourceMap**: Local path to your source map file.
- **minifiedFile**: Local path to your minified bundle file.

**Note:** all the properties are mandatory

And then you run the uploader from command line:

```sh
$ npx contactsnag upload

# --- or ---

$ yarn contactsnag upload
```

or through a script in `package.json` file:

```json
{
  "scripts": {
    "csnag:upload": "contactsnag upload"
  }
}
```

## JS usage example

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

## License

[Apache 2.0](LICENSE).
