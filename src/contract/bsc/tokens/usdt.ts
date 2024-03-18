import { Contract } from 'ethers'
import { TypedContract } from 'ethers-abitype'
import { abi } from '../../../abi/erc20Abi.js'
import { provider } from '../../../provider/bscProvider.js'
import { ContractAddress } from '../../../types/def.js'

const CONTRACT_ADDRESS: ContractAddress = '0x55d398326f99059ff775485246999027b3197955'

export const contract = new Contract(CONTRACT_ADDRESS, abi, provider) as unknown as TypedContract<typeof abi>
