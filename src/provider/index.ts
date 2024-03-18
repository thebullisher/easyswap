import { Provider } from 'ethers'
import { provider as ethProvider } from './ethProvider.js'
import { provider as bscProvider } from './bscProvider.js'
import { ProviderName } from './types.js'

export const PROVIDERS: Provider[] = [
  ethProvider,
  bscProvider,
]

export async function getProvider(name: ProviderName): Promise<Provider | null> {
  let provider

  for (const p of PROVIDERS) {
    const network = await p.getNetwork()
    if (name.toLowerCase() === network.name.toLowerCase()) {
      provider = p
      break
    }
  }

  if (!provider) {
    throw new Error(`Provider ${name} not found!`)
  }

  return provider
}
