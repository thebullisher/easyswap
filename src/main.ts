import chalk from 'chalk';
import { config } from './config.js'
import { provider as ethProvider } from './provider/ethProvider.js'
/**
 * main entrypoint
 */
export async function main(argv) {
  const [amount, pair1, pair2] = argv._
  console.log(chalk.cyanBright('program start'))
  console.log({
    amount,
    pair1,
    pair2,
    config
  })
  // Look up the current block number (i.e. height)
  const blockNumber = await ethProvider.getBlockNumber()
  console.log(chalk.green(`ethereum current block number: `), blockNumber)
  console.log(chalk.cyanBright('end of program'))
}
