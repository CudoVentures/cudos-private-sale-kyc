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
    invalidEmail = 'Invalid email format',
    invalidData = 'Invalid Data',
    shouldBeMoreThan = 'Amount should be more than $1000.00',
    invalidName = 'Invalid Name',
    invalidNftCount = 'Maximum 20',
    invalidTiers = 'Maximum 50 in total',
    invalidTiersTotal = 'Minimum $1,275.00'
}

export enum FormField {
    connectedAddress = 'connectedAddress',
    firstName = 'firstName',
    lastName = 'lastName',
    amountToSpend = 'amountToSpend',
    email = 'email',
    nftCount = 'nftCount',
    externalWallet = 'externalWallet',
    nftTiers = 'nftTiers',
    nftTiersTotal = 'nftTiersTotal'
}
