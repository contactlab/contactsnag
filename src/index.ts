import Bugsnag from '@bugsnag/js';
import {create} from './client';

// --- Re-exports
export {Client} from './client';
export {Config} from './validate';

// --- Define an actual `Client` function with Bugsnag client creator
export const ContactSnag = create(Bugsnag);
