import { Wallet } from 'ethers'
import { config } from '../config.js'
import { provider } from '../provider/bscProvider.js'

export const wallet = new Wallet(config.PRIVATE_WALLET_KEY, provider)
