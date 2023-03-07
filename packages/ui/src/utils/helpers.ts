import { StdSignature, SUPPORTED_WALLET } from "cudosjs"
import { connectLedgerByType } from "./config"
import { CHAIN_DETAILS } from "./constants"
import { isValidCudosAddress } from "components/FormField/validation";
import { NftQuantities, NftTier } from "components/Pricelist";
import { getNftQuantities } from "./firebase";

export const getAvailableNftQuantities = async (): Promise<NftQuantities> => {
  const data = await getNftQuantities()
  let result = {}
  for (const [tier, qty] of Object.entries(data)) {
    if (tier === 'BlueDiamond') {
      result[NftTier.BlueDiamond] = qty
    } else {
      result[tier] = qty
    }
  }
  return result as NftQuantities
}

export const signArbitrary = async (
  walletType: SUPPORTED_WALLET,
  signingAddress: string,
  message: string
):
  Promise<{ signature: StdSignature }> => {
  const chainId = CHAIN_DETAILS.CHAIN_ID[CHAIN_DETAILS.DEFAULT_NETWORK]
  let signature: StdSignature = {
    pub_key: { type: '', value: '' },
    signature: ""
  }
  if (walletType === SUPPORTED_WALLET.Keplr) {
    signature = await window.keplr!.signArbitrary(chainId, signingAddress, message)
  }

  if (walletType === SUPPORTED_WALLET.Cosmostation) {
    signature = await window.cosmostation.providers.keplr.signArbitrary(chainId, signingAddress, message)
  }
  return { signature }
}

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
