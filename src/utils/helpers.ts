import { BigNumber } from "bignumber.js"
import { Coin } from "cudosjs"
import { connectLedgerByType, getQueryClient } from "./config"
import { CHAIN_DETAILS } from "./constants"
import { isValidCudosAddress } from "./validation"

export const getConnectedUserAddressAndName = async (chosenNetwork: string, ledgerType: string): Promise<{ address: string; accountName: string; }> => {

  const { address, accountName } = await connectLedgerByType(chosenNetwork, ledgerType)

  if (!isValidCudosAddress(address)) {
    throw new Error("Invalid ledger");
  }

  return { address: address, accountName: accountName }
}

export const updateChosenBalance = (balances: readonly Coin[], chosenBalance: Coin): Coin => {
  let updatedBalance: Coin = { denom: '', amount: '0' }

  balances.forEach((newBalance) => {
    if (newBalance.denom === chosenBalance.denom) {
      updatedBalance = newBalance
    }
  })

  if (!updatedBalance.denom) {
    updatedBalance = {
      denom: CHAIN_DETAILS.NATIVE_TOKEN_DENOM,
      amount: getNativeBalance(balances)
    }
  }

  return updatedBalance
}

export const checkForAdminToken = (balances: readonly Coin[]): boolean => {
  let isAdmin: boolean = false
  balances.forEach((balance) => {
    if (balance.denom === CHAIN_DETAILS.ADMIN_TOKEN_DENOM && parseInt(balance.amount) > 0) {
      isAdmin = true
    }
  })
  return isAdmin
}

export const getNativeBalance = (balances: readonly Coin[]): string => {
  let nativeBalance = '0'
  balances.forEach((balance) => {
    if (balance.denom === CHAIN_DETAILS.NATIVE_TOKEN_DENOM && new BigNumber(balance.amount).gt(0)) {
      nativeBalance = balance.amount
    }
  })
  return nativeBalance
}

export const getAccountBalances = async (chosenNetwork: string, accountAddress: string): Promise<readonly Coin[]> => {
  const queryClient = await getQueryClient(chosenNetwork)
  return queryClient.getAllBalances(accountAddress)
}

export const formatAddress = (text: string, sliceIndex: number): string => {
  if (!text) { return '' }
  const len = text.length
  if (text === null || text.length < 10) {
    return text
  }
  return `${text.slice(0, sliceIndex)}...${text.slice(len - 4, len)}`
}

export const chainIDToAlias = (chainID: string): string => {

  const ID = chainID ? chainID.toLowerCase() : ''

  if (CHAIN_DETAILS.LOCAL.SHORT_NAMES.some(shortName => ID.includes(shortName))) {
    return CHAIN_DETAILS.LOCAL.ALIAS_NAME
  }

  if (CHAIN_DETAILS.PRIVATE.SHORT_NAMES.some(shortName => ID.includes(shortName))) {
    return CHAIN_DETAILS.PRIVATE.ALIAS_NAME
  }

  if (CHAIN_DETAILS.PUBLIC.SHORT_NAMES.some(shortName => ID.includes(shortName))) {
    return CHAIN_DETAILS.PUBLIC.ALIAS_NAME
  }

  if (CHAIN_DETAILS.MAINNET.SHORT_NAMES.some(shortName => ID.includes(shortName))) {
    return CHAIN_DETAILS.MAINNET.ALIAS_NAME
  }

  return "Unidentified Network"
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
