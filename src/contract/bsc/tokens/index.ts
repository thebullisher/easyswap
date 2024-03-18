import { TypedContract } from 'ethers-abitype'
import { TokenSymbols } from './types.js'
import { contract as wbnbContract } from './wbnb.js'
import { contract as busdContract } from './busd.js'
import { contract as usdtContract } from './usdt.js'
import { abi } from '../../../abi/erc20Abi.js'


type TypeTokenContract = TypedContract<typeof abi>

export const TOKEN_CONTRACTS: TypeTokenContract[] = [
  wbnbContract,
  busdContract,
  usdtContract,
]

interface GetTokenContract {
  silent?: boolean
}

export async function getTokenContract(symbol: TokenSymbols, { silent }: GetTokenContract = { silent: false }) {
  let contract: TypeTokenContract | null
  for (const c of TOKEN_CONTRACTS) {
    if (symbol?.toLowerCase() == (await c.symbol()).toLowerCase()) {
      contract = c
    }
  }

  if (!silent && !contract) {
    throw new Error(`Contract ${symbol} not found!`)
  }

  return contract
}
