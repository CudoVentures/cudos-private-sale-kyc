import { StdSignature, SUPPORTED_WALLET } from "cudosjs"
import { connectLedgerByType } from "./config"
import { CHAIN_DETAILS } from "./constants"
import { getTiersTotalSum, isValidCudosAddress } from "components/FormField/validation";
import { NftQuantities, NftTier as NftTierEnum } from "store/nftTiers";
import { getNftLimit, getNftQuantities } from "./firebase";
import { Currencies, CURRENCY_RATES } from "../../../common/types";
import { NftTier as NftTierInterface } from "store/user";

export const getTotalAmounts = (
  nftTiers: Record<string, NftTierInterface>,
  currencyRates: CURRENCY_RATES,
  chosenCurrency: Currencies
): { usdAmount: number, stringifiedConvertedAmount: string } => {

  const stringifyConvertedAmount = (amount: number) => {
    if (chosenCurrency === Currencies.USDC || chosenCurrency === Currencies.USDT) {
      return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    }
    return `${amount.toFixed(8)}`
  }

  const usdAmount = getTiersTotalSum(nftTiers!)
  const convertedAmount = usdAmount / currencyRates![chosenCurrency!]
  const stringifiedConvertedAmount = stringifyConvertedAmount(convertedAmount)
  return { usdAmount, stringifiedConvertedAmount }
}
export const getAvailableNftQuantities = async (): Promise<{ quantities: NftQuantities, limit: number }> => {
  const qtyData = await getNftQuantities()
  const limitData = await getNftLimit()
  const defaultLimit = 50
  let result = {}
  for (const [tier, qty] of Object.entries(qtyData)) {
    if (tier === 'BlueDiamond') {
      result[NftTierEnum.BlueDiamond] = qty
    } else {
      result[tier] = qty
    }
  }
  return { quantities: result as NftQuantities, limit: limitData.total || defaultLimit }
}

export const signArbitrary = async (
  walletType: SUPPORTED_WALLET,
  signingAddress: string,
  message: string
):
  Promise<{ signature: StdSignature }> => {
  const chainId = CHAIN_DETAILS.CHAIN_ID
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

export const getConnectedUserAddressAndName = async (ledgerType: string): Promise<{ address: string; accountName: string; }> => {

  const { address, accountName } = await connectLedgerByType(ledgerType)

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
