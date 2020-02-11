#!/usr/bin/env node

// tslint:disable-next-line:no-var-requires
require('make-promises-safe');

import { commandDir } from 'yargs';

// tslint:disable-next-line:no-unused-expression
commandDir('commands')
  .demandCommand()
  .help().argv;
