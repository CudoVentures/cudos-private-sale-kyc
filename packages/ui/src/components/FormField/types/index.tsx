import { APP_DETAILS } from "utils/constants"

export enum Currencies {
    ETH = 'ETH',
    USDC = 'USDC',
    USDT = 'USDT',
    SOL = 'SOL',
    CUDOS = 'CUDOS'
}

export enum CurrencyAlias {
    ethereum = 'ethereum',
    solana = 'solana',
    tether = 'tether',
    usdCoin = 'usd-coin',
    cudos = 'cudos'
}

export const CurrencyToInternalWalletMapper = {
    [Currencies.ETH]: APP_DETAILS.internalAddresses.ETHEREUM,
    [Currencies.SOL]: APP_DETAILS.internalAddresses.SOLANA,
    [Currencies.USDT]: APP_DETAILS.internalAddresses.ETHEREUM,
    [Currencies.USDC]: APP_DETAILS.internalAddresses.ETHEREUM,
    [Currencies.CUDOS]: APP_DETAILS.internalAddresses.CUDOS
}

export const CurrencyToWalletAliasMapper = {
    [Currencies.ETH]: CurrencyAlias.ethereum,
    [Currencies.SOL]: CurrencyAlias.solana,
    [Currencies.USDT]: CurrencyAlias.ethereum,
    [Currencies.USDC]: CurrencyAlias.ethereum,
    [Currencies.CUDOS]: CurrencyAlias.cudos
}

export const CurrencyToAlias = {
    [Currencies.ETH]: CurrencyAlias.ethereum,
    [Currencies.SOL]: CurrencyAlias.solana,
    [Currencies.USDT]: CurrencyAlias.tether,
    [Currencies.USDC]: CurrencyAlias.usdCoin,
    [Currencies.CUDOS]: CurrencyAlias.cudos
}

export const AliasToCurrency = {
    [CurrencyAlias.ethereum]: Currencies.ETH,
    [CurrencyAlias.solana]: Currencies.SOL,
    [CurrencyAlias.tether]: Currencies.USDT,
    [CurrencyAlias.usdCoin]: Currencies.USDC,
    [CurrencyAlias.cudos]: Currencies.CUDOS
}

export type CURRENCY_RATES = {
    [key in Currencies]: number
}

export const defaultCurrencyRates: CURRENCY_RATES = {
    ETH: 0,
    USDC: 1,
    USDT: 1,
    SOL: 0,
    CUDOS: 0
}

export enum FormFieldErrors {
    invalidCudosAddress = 'Invalid Cudos Address',
    invalidSolanaAddress = 'Invalid Solana Address',
    invalidEthereumAddress = 'Invalid Ethereum Address',
    invalidEmail = 'Invalid email format',
    invalidData = 'Invalid Data',
    invalidName = 'Invalid Name',
    invalidNftCount = 'Maximum 20',
    invalidTiersTotal = 'Minimum $1,275.00'
}

export enum FormField {
    connectedAddress = 'connectedAddress',
    firstName = 'firstName',
    lastName = 'lastName',
    email = 'email',
    nftCount = 'nftCount',
    externalWallet = 'externalWallet',
    internalWallet = 'internalWallet',
    tocAgreed = 'tocAgreed',
    nftTiers = 'nftTiers',
    nftTiersTotal = 'nftTiersTotal'
}
