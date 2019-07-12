declare module 'bugsnag-sourcemaps' {
  /**
   * Provide options to the source map uploader.
   * @see https://docs.bugsnag.com/build-integrations/js/#source-map-uploader
   */
  export interface BugsnagSourceMapsConfig {
    /**
     * Your Bugsnag API key
     */
    apiKey: string;

    /**
     * The version of the application you are building (this should match the `appVersion` configured in your notifier).
     * If `appVersion` is not supplied, the `version` property from the nearest `package.json` will be used.
     */
    appVersion?: string;

    /**
     * Whether to scan `projectRoot` for source maps, uploading them all.
     * If a string is provided, it searches that path instead.
     * This option makes `minifiedFile`, `minifiedUrl` and `sourceMap` redundant.
     * This option is only for Node projects where one source map is created per source file.
     */
    directory?: boolean | string;

    /**
     * Defaults to `https://upload.bugsnag.com`.
     * If you are using Bugsnag On-premise use your Bugsnag Upload API endpoint
     */
    endpoint?: string;

    /**
     * File path of the minified file on the current machine
     */
    minifiedFile?: string;

    /**
     * The URL of your bundled assets (as the browser will see them).
     * Note that this can [include wildcards](https://docs.bugsnag.com/api/js-source-map-upload/#do-you-support-partial-matching-wildcards-for-the-minified-url) in case your JS is served at multiple URLs.
     */
    minifiedUrl?: string;

    /**
     * Whether you want to overwrite previously uploaded source maps
     */
    overwrite?: boolean;

    /**
     * The root path to remove from absolute paths
     */
    projectRoot?: string;

    /**
     * File path of the source map on the current machine
     */
    sourceMap?: string;

    /**
     * Object paths to original source file locations on the current machine.
     * This option is useful when the sources are not included in the source map.
     */
    sources?: Record<string, string>;

    /**
     * If the source content was not included in the source map, this option will retrieve the sources and attach them
     */
    uploadSources?: boolean;
  }

  export function upload(config: BugsnagSourceMapsConfig): Promise<void>;
}
