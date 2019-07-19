import {default as bugsnag} from '@bugsnag/js';
import {client} from './client';

// --- Re-exports
export {Client, Config} from './client';
export {notify} from './notify';
export {AnyBugsnagConfig, setOptions} from './set-options';

// --- Define an actual `Client` function with Bugsnag client creator
export const ContactSnag = client(bugsnag);
