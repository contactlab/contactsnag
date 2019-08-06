import {default as bugsnag} from '@bugsnag/js';
import {create} from './client';

// --- Re-exports
export {Client} from './client';
export {Config} from './validate';
export {AnyBugsnagConfig} from './bugsnag';

// --- Define an actual `Client` function with Bugsnag client creator
export const ContactSnag = create(bugsnag);
