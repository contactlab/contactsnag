'use strict';

import Bugsnag from 'bugsnag-js';
import package from 'package.json';

// Bugsnag configuration
Bugsnag.apiKey = package.bugsnag.apiKey;
Bugsnag.endpoint = 'https://notify-bugsnag.contactlab.it/js';
Bugsnag.user = null;
Bugsnag.notifyReleaseStages = ["development"];
Bugsnag.releaseStage = "development";
Bugsnag.context = null;
Bugsnag.disableAutoBreadcrumbsConsole();

// Export instance reference of Bugsnag
export const ContactSnag = Bugsnag;
