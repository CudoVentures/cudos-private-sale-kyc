import { CHAIN_DETAILS } from "utils/constants"

export const EXPLORER_ADDRESS_DETAILS = (chosenNetwork: string, accountAddress: string) =>
  `${CHAIN_DETAILS.EXPLORER_URL[chosenNetwork]}/account/${accountAddress}`

export const GET_CURRENCY_RATE_URL = (from: string, to: string) =>
  `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${from}&tsyms=${to}`
