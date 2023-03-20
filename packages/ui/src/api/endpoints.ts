import { CHAIN_DETAILS } from "utils/constants"

export const EXPLORER_ADDRESS_DETAILS = (chosenNetwork: string, accountAddress: string) =>
  `${CHAIN_DETAILS.EXPLORER_URL[chosenNetwork]}/account/${accountAddress}`

export const GET_CURRENCY_RATE_URL = (from: string, to: string) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`
