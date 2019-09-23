/*tslint:disable no-console*/

import chalk from 'chalk';
import {fold} from 'fp-ts/lib/Either';
import {TaskEither} from 'fp-ts/lib/TaskEither';

export type Program<A = string> = TaskEither<Error, A>;

const errorTxt = chalk.bold.redBright;
const successTxt = chalk.bold.greenBright;

export const run = (program: Program): Promise<void> =>
  program().then(
    fold(
      err => {
        console.error(errorTxt(`\n🗴 ${err.message}\n`));
        process.exit(1);
      },
      msg => {
        console.log(successTxt(`\n🗸 ${msg}\n`));
        process.exit(0);
      }
    )
  );
