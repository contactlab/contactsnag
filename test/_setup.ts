// eslint-disable-next-line @typescript-eslint/no-var-requires
const gt = require('globalthis/polyfill')();

(global as any).globalthis = gt;
