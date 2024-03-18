import { Contract } from 'ethers'
import { TypedContract } from 'ethers-abitype'
import { ContractAddress } from '../../../types/def.js'
import { abi } from '../../../abi/erc20Abi.js'
import { provider } from '../../../provider/bscProvider.js'

const CONTRACT_ADDRESS: ContractAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'

export const contract = new Contract(CONTRACT_ADDRESS, abi, provider) as unknown as TypedContract<typeof abi>
