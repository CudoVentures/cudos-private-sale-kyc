import { CHAIN_DETAILS } from "utils/constants"

export const EXPLORER_ADDRESS_DETAILS = (chosenNetwork: string, accountAddress: string) =>
  `${CHAIN_DETAILS.EXPLORER_URL[chosenNetwork]}/account/${accountAddress}`
