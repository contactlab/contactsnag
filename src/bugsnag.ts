import {Bugsnag} from '@bugsnag/js';

export {Bugsnag} from '@bugsnag/js';

/**
 * @description Keep only known keys and remove indexable types from T
 */
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {[_ in keyof T]: infer U}
  ? U
  : never;

export type BugsnagConfig = Pick<Bugsnag.IConfig, KnownKeys<Bugsnag.IConfig>>;

export type AnyBugsnagConfig = Partial<Bugsnag.IConfig>;

export interface BugsnagClientCreator {
  (config: Bugsnag.IConfig): Bugsnag.Client;
}
