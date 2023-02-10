import { connectLedgerByType } from "./config"
import { CHAIN_DETAILS } from "./constants"
import { isValidCudosAddress } from "components/FormField/validation";

export const getConnectedUserAddressAndName = async (chosenNetwork: string, ledgerType: string): Promise<{ address: string; accountName: string; }> => {

  const { address, accountName } = await connectLedgerByType(chosenNetwork, ledgerType)

  if (!isValidCudosAddress(address)) {
    throw new Error("Invalid ledger");
  }

  return { address: address, accountName: accountName }
}

export const formatAddress = (text: string, sliceIndex: number): string => {
  if (!text) { return '' }
  const len = text.length
  if (text === null || text.length < 10) {
    return text
  }
  return `${text.slice(0, sliceIndex)}...${text.slice(len - 4, len)}`
}

export const handleAvailableNetworks = (defaultNetwork: string): networkToDisplay[] => {

  if (CHAIN_DETAILS.LOCAL.SHORT_NAMES.includes(defaultNetwork.toLowerCase())) {
    return [CHAIN_DETAILS.LOCAL]
  }

  if (CHAIN_DETAILS.PRIVATE.SHORT_NAMES.includes(defaultNetwork.toLowerCase())) {
    return [CHAIN_DETAILS.PRIVATE]
  }

  return [CHAIN_DETAILS.PUBLIC, CHAIN_DETAILS.MAINNET]
}
