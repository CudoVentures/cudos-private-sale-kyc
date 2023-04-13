import { CHAIN_DETAILS } from "utils/constants"

export const EXPLORER_ADDRESS_DETAILS = (accountAddress: string) =>
  `${CHAIN_DETAILS.EXPLORER_URL}/account/${accountAddress}`
