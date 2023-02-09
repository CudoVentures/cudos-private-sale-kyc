import { CHAIN_DETAILS } from "utils/constants"

export const GET_BALANCE_URL = (chosenNetwork: string, accountAddress: string) =>
  `${CHAIN_DETAILS.API_ADDRESS[chosenNetwork]}/bank/balances/${accountAddress}`

export const EXPLORER_ADDRESS_DETAILS = (chosenNetwork: string, accountAddress: string) =>
  `${CHAIN_DETAILS.EXPLORER_URL[chosenNetwork]}/account/${accountAddress}`

export const TX_HASH_DETAILS = (chosenNetwork: string, txHash: string) =>
  `${CHAIN_DETAILS.EXPLORER_URL[chosenNetwork]}/transactions/${txHash}`

export const GET_COINGECKO_CURRENCY_URL = (currency: string) =>
`https://api.coingecko.com/api/v3/simple/price?ids=CUDOS&vs_currencies=${currency}`
