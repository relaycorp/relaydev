import { Argv } from 'yargs';

export const command = 'key';

export const description = 'Key management';

export function builder(yargs: Argv): Argv {
  return yargs.commandDir('key_commands').demandCommand().help();
}
