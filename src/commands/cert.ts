import { Argv } from 'yargs';

export const command = 'cert';

export const description = 'Certificate management';

export function builder(yargs: Argv): Argv {
  return yargs.commandDir('cert_commands').demandCommand().help();
}
