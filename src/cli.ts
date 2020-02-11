#!/usr/bin/env node

import { commandDir } from 'yargs';

// tslint:disable-next-line:no-unused-expression
commandDir('commands')
  .demandCommand()
  .help().argv;
