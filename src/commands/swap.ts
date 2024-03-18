import { Arguments, CommandBuilder } from 'yargs'
import { formatUnits, parseUnits } from 'ethers'
import { contract as wbnbContract } from '../contract/bsc/tokens/wbnb.js'
import { getTokenContract } from '../contract/bsc/tokens/index.js'
import { TokenSymbols } from '../contract/bsc/tokens/types.js'
import { pancakeRouterV2 } from '../contract/bsc/pancakeRouterV2.js'
import { wallet } from '../wallet/appWallet.js'
import { getProvider } from '../provider/index.js'
import { ProviderName } from '../provider/types.js'
import { ContractAddress } from '../types/def.js'

// TODO: move to configuration
const GWEI_DECIMAL = 9

interface SwapArgs {
  amount: string
  pairIn: TokenSymbols
  pairOut: TokenSymbols
}

export const command = 'swap [amount] [pairIn] [pairOut]'

export const describe = 'Swap amount from a pair to another'

export const builder: CommandBuilder<SwapArgs> = {
  amount: {
    type: 'string',
    default: '0.00576'
  },
  pairIn: {
    type: 'string',
    default: TokenSymbols.USDT
  },
  pairOut: {
    type: 'string',
    default: TokenSymbols.BUSD
  }
}

export const handler = async ({ amount, pairIn, pairOut }: Arguments<SwapArgs>) => {
  try {
    const provider = await getProvider(ProviderName.BSC)
    const network = await provider.getNetwork()
    let contractIn = await getTokenContract(pairIn, { silent: true })
    let contractOut = await getTokenContract(pairOut, { silent: true })
    console.log({ amount, pairIn, pairOut })

    if (!contractIn) {
      contractIn = wbnbContract
    } else if (!contractOut) {
      contractOut = wbnbContract
    }

    const nonce = await provider.getTransactionCount(wallet.address)
    const decimalsIn = await contractIn.decimals()
    const amountToSwap = parseUnits(amount, decimalsIn)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    if (pairIn.toLowerCase() === TokenSymbols.BNB.toLowerCase()) {
      // native to erc20 case

      const data = await pancakeRouterV2.swapExactETHForTokens.populateTransaction(
        0,
        [await contractIn.getAddress(), await contractOut.getAddress()],
        wallet.address,
        deadline
      )
      const tx = {
          ...data,
          nonce,
          value: amountToSwap,
          gasLimit: 250000,
          gasPrice: 3 * (10 ** GWEI_DECIMAL),
          chainId: network.chainId
      }
      const signedTx = await wallet.signTransaction(tx)
      const receipt = await provider.broadcastTransaction(signedTx)
      console.log('Swap successful!', receipt)

    } else if (pairOut.toLowerCase() === TokenSymbols.BNB.toLowerCase()) {
      // erc20 to native
      // This code looks very similar to erc20 to erc20

      // approve will allow pancake to use contractIn currency, this is necessary because it is not native currency
      const dataApprove = await contractIn.approve.populateTransaction(await pancakeRouterV2.getAddress() as ContractAddress, amountToSwap as never)
      const txApprove = {
        ...dataApprove,
        nonce,
        gasLimit: 250000, // 70000
        gasPrice: 3 * (10 ** GWEI_DECIMAL),
        chainId: network.chainId
      }
      const signedApproveTx = await wallet.signTransaction(txApprove)
      const receiptApprove = await provider.broadcastTransaction(signedApproveTx)
      console.log('receiptApprove', receiptApprove)

      // Vérification que PancakeRouter peut utiliser le token ERC20
      const allowance = await contractIn.allowance(wallet.address as ContractAddress, pancakeRouterV2 as never)
      console.log('Allowance for PancakeRouter:', await contractIn.symbol(), formatUnits(allowance, decimalsIn))

      const data = await pancakeRouterV2.swapExactTokensForETH.populateTransaction(
        amountToSwap,
        0,
        [await contractIn.getAddress(), await contractOut.getAddress()],
        wallet.address,
        deadline
      )
      const tx = {
        ...data,
        nonce: nonce + 1,
        gasLimit: 250000,
        gasPrice: 3 * (10 ** GWEI_DECIMAL),
        chainId: network.chainId
      }
      const signedTx = await wallet.signTransaction(tx)
      const receipt = await provider.broadcastTransaction(signedTx)
      console.log('Swap successful!', receipt)
    } else {
      // erc20 to erc20

      // approve will allow pancake to use contractIn currency, this is necessary because it is not native currency
      const dataApprove = await contractIn.approve.populateTransaction(await pancakeRouterV2.getAddress() as ContractAddress, amountToSwap as never)
      const txApprove = {
          ...dataApprove,
          nonce,
          gasLimit: 250000,
          gasPrice: 3 * (10 ** GWEI_DECIMAL),
          chainId: network.chainId
      }
      const signedApproveTx = await wallet.signTransaction(txApprove)
      const receiptApprove = await provider.broadcastTransaction(signedApproveTx)
      console.log('receiptApprove', receiptApprove)

      // Vérification que PancakeRouter peut utiliser le token ERC20
      const allowance = await contractIn.allowance(wallet.address as ContractAddress, pancakeRouterV2 as never)
      console.log('Allowance for PancakeRouter:', await contractIn.symbol(), formatUnits(allowance, decimalsIn))

      const data = await pancakeRouterV2.swapExactTokensForTokens.populateTransaction(
        amountToSwap,
        0,
        [await contractIn.getAddress(), await contractOut.getAddress()],
        wallet.address,
        deadline
      )
      const tx = {
          ...data,
          nonce: nonce + 1,
          gasLimit: 250000,
          gasPrice: 3 * (10 ** GWEI_DECIMAL),
          chainId: network.chainId
      }
      const signedTx = await wallet.signTransaction(tx)
      const receipt = await provider.broadcastTransaction(signedTx)
      console.log('Swap successful!', receipt)
    }
  }
  catch (error) {
    console.error(error)
  }
}
