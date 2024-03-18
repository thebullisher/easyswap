import { JsonRpcProvider, Provider } from 'ethers'

import { config } from '../config.js'

/**
 * @name provider
 * @type {Provider} binance smart chain for read operation on bsc blockchain
 */
export const provider: Provider = new JsonRpcProvider(config.JSON_RPC_PROVIDER_BSC)
