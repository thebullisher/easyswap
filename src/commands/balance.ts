import { Arguments, CommandBuilder } from 'yargs'
import chalk from 'chalk'
import { formatUnits } from 'ethers'
import { getProvider } from '../provider/index.js'
import { ContractAddress } from '../types/def.js'
import { getTokenContract } from '../contract/bsc/tokens/index.js'
import { wallet } from '../wallet/appWallet.js'
import { TokenSymbols } from '../contract/bsc/tokens/types.js'
import { ProviderName } from '../provider/types.js'

interface BalanceArgs {
  walletAddress: ContractAddress
  token: TokenSymbols
  providerName: ProviderName
}

export const command = 'balance [providerName] [walletAddress] [token]'

export const describe = 'Show wallet balance for a designated token'

export const builder: CommandBuilder<BalanceArgs> = {
  providerName: {
    type: 'string',
    default: ProviderName.BSC,
  },
  walletAddress: {
    type: 'string',
    default: wallet.address,
  },
  token: {
    type: 'string',
    default: null,
  },
}


export const handler = async ({ providerName, walletAddress, token }: Arguments<BalanceArgs>) => {
  try {
    const provider = await getProvider(providerName)
    const balance = await provider.getBalance(walletAddress)

    const contract = await getTokenContract(token, { silent: true })

    if (contract) {
      // erc20 token case
      const balance = await contract.balanceOf(walletAddress)

      console.log(
        chalk.red(formatUnits(balance, await contract.decimals())),
        await contract.symbol(),
      )
    } else {
      // native token case
      console.log(
        chalk.red(formatUnits(balance)),
        ((await provider.getNetwork()).name).toUpperCase(),
      )
    }
  } catch (error) {
    console.error(error)
  }
}
