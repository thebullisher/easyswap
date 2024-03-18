import { Arguments, CommandBuilder } from 'yargs'
import chalk from 'chalk'
import { parseUnits, formatUnits } from 'ethers'
import { pancakeRouterV2 } from '../contract/bsc/pancakeRouterV2.js'
import { contract as wbnbContract } from '../contract/bsc/tokens/wbnb.js'
import { TokenSymbols } from '../contract/bsc/tokens/types.js'
import { getTokenContract } from '../contract/bsc/tokens/index.js'

interface ConvertArgs {
  amount: string
  pairIn: TokenSymbols
  pairOut: TokenSymbols
}

export const command = 'convert [pairIn] [pairOut] [amount]'

export const describe = 'Convert pairIn to pairOut'

export const builder: CommandBuilder<ConvertArgs> = {
  pairIn: {
    type: 'string',
    default: TokenSymbols.BNB
  },
  pairOut: {
    type: 'string',
    default: TokenSymbols.USDT
  },
  amount: {
    type: 'string',
    default: '0.021',
  },
}


export const handler = async ({ pairIn, pairOut, amount }: Arguments<ConvertArgs>) => {
  try {
    let contractIn = await getTokenContract(pairIn, { silent: true })
    let contractOut = await getTokenContract(pairOut, { silent: true })

    // These convert only support BSC native token (wbnbContract is hard coded)
    if (!contractIn) {
      contractIn = wbnbContract
    } else if (!contractOut) {
      contractOut = wbnbContract
    }

    const preciseAmount = parseUnits(amount, await contractIn.decimals())
    const amountsOut = await pancakeRouterV2.getAmountsOut(preciseAmount, [await contractIn.getAddress(), await contractOut.getAddress()])

    console.log(
      chalk.red(formatUnits(preciseAmount, await contractIn.decimals())),
      await contractIn.symbol(),
      '=',
      chalk.red(formatUnits(amountsOut[1], await contractOut.decimals())),
      await contractOut.symbol()
    )
  } catch (error) {
    console.error(error)
  }
}
