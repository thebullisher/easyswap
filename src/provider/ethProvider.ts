import { getDefaultProvider, Provider } from 'ethers'

/**
 * @name provider
 * @type {Provider} ethereum provider for read operation on ethereum blockchain
 */
export const provider: Provider = getDefaultProvider()
