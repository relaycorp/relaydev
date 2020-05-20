import { Argv } from 'yargs';

export const command = 'ramf';

export const description = 'RAMF serialization';

export function builder(yargs: Argv): Argv {
  return yargs.commandDir('ramf_commands').demandCommand().help();
}
