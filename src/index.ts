import Bugsnag from 'bugsnag-js';

const project = require('../../../package.json'); // tslint:disable-line

// Bugsnag configuration
Bugsnag.apiKey = project.bugsnag.apiKey;
Bugsnag.endpoint = 'https://notify-bugsnag.contactlab.it/js';
Bugsnag.user = {};
Bugsnag.notifyReleaseStages = ['development'];
Bugsnag.releaseStage = 'development';
Bugsnag.context = '';
Bugsnag.disableAutoBreadcrumbsConsole();

// Export instance reference of Bugsnag
export const ContactSnag = Bugsnag;
