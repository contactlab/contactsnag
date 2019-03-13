/*tslint:disable no-console*/

import chalk from 'chalk';
import {TaskEither} from 'fp-ts/lib/TaskEither';

export type Program = TaskEither<Error, string>;

const errorTxt = chalk.bold.redBright;
const successTxt = chalk.bold.greenBright;

export const main = (program: Program): Promise<void> =>
  program.run().then(result =>
    result.fold(
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
