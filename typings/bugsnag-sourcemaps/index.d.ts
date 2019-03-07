declare module 'bugsnag-sourcemaps' {
  export interface BugsnagSourceMapsConfig {
    /**
     * your Bugsnag API key
     */
    apiKey: string;

    /**
     * file path of the source map on the current machine
     */
    sourceMap: string;

    /**
     * the URL of your bundled assets (as the browser will see them). Note that this can include wildcards in case your JS is served at multiple URLs.
     */
    minifiedUrl?: string;

    /**
     * the version of the application you are building (this should match the appVersion configured in your notifier)
     */
    appVersion?: string;

    /**
     * file path of the minified file on the current machine
     */
    minifiedFile?: string;

    /**
     * object paths to original source file locations on the current machine. This option is useful when the sources are not included in the source map.
     */
    sources?: object;

    /**
     * The root path to remove from absolute paths
     */
    projectRoot?: string;

    /**
     * If the source content was not included in the source map, this option will retrieve the sources and attach them
     */
    uploadSources?: boolean;

    /**
     * whether you want to overwrite previously uploaded source maps
     */
    overwrite?: boolean;

    /**
     * Defaults to https://upload.bugsnag.com. If you are using Bugsnag On-premise use your Bugsnag Upload API endpoint
     */
    endpoint?: string;
  }

  export function upload(config: BugsnagSourceMapsConfig): Promise<void>;
}
