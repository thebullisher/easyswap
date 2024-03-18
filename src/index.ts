import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as balance from './commands/balance.js'
import * as convert from './commands/convert.js'
import * as swap from './commands/swap.js'

yargs(hideBin(process.argv))
  .command(balance)
  .command(convert)
  .command(swap)
  .demandCommand(1)
  .help()
  .parse()
