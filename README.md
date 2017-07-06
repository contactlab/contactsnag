# contactsnag
> [Bugsnag]() utilities for Contactlab's applications.

This package embeds 2 main functionalities:

* **Javascript wrapper for Bugsnag**: importing `ContactSnag` in your frontend code gives you access to a pre-configured Bugsnag browser SDK object wrapper that exposes the same APIs of the original SDK.
* **CLI sourcemap uploader**: calling `contactsnag` from the command line it will upload your `./app/bundle.map.js` to the Bugsnag dashboard (using the Bugsnag API endpoint) for better error debugging.

### Install
Get the latest version from NPM registry:

```
$ npm install contactsnag --save
-- or --
$ yarn add contactsnag
```

### Configuration
Add a `bugsnag` node in the root `package.json` of your application to set few parameters:

```javascript
...
"bugsnag": {
  "apiKey": "my-project-api-key",
  "minifiedUrl": "https://my.application.com/bundle.js"
  "sourceMap": "./path/to/your/source.map.js",
  "minifiedFile": "./path/to/your/minified.js"
}
...
```

* **apiKey**: is used both by the Bugsnag instance to send error reports to the dashboard and by the uploader to authenticate with the upload API.
* **minifiedUrl**: [docs here](https://docs.bugsnag.com/api/js-source-map-upload/#uploading-source-maps).
* **[sourceMap]**: Path to your source map file. Default: `./app/bundle.js.map`.
* **[minifiedFile]**: Path to your minified bundle file. Default: `./app/bundle.js`.

### JS usage example
```javascript
import {ContactSnag} from 'contactsnag';

ContactSnag.notify(
  'My error name',
  'Custome error message',
  { some: 'optional data' }
);
```

### License
[Apache 2.0](LICENSE).
