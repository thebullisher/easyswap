import { Contract } from 'ethers'
import { ContractAddress } from '../../types/def.js'
import { abi } from '../../abi/pancakeRouterV2Abi.js'
import { provider } from '../../provider/bscProvider.js'

export const ROUTER_V2_PANCAKE_CONTRACT_ADDRESS: ContractAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
export const pancakeRouterV2 = new Contract(ROUTER_V2_PANCAKE_CONTRACT_ADDRESS, abi, provider)
