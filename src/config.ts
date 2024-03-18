import { existsSync } from 'fs'
import { config as readConfig } from 'dotenv'

/**
 * @type {Config} Config interface
 */
export interface Config {
  /** JSON RPC Provider for Binance Smart Chain */
  JSON_RPC_PROVIDER_BSC: string
  /** The ERC20 wallet private key */
  PRIVATE_WALLET_KEY: string
}

function read(): Config {
  const result = readConfig({
    path: existsSync('.env.local') && process.env.NODE_ENV !== 'test' ? ['.env.local', '.env'] : ['.env']
  })
  if (result.error) {
    throw result.error
  }
  return result.parsed as unknown as Config
}

export const config = read()
