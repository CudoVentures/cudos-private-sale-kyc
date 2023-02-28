export enum Currencies {
    ETH = 'ETH',
    USDC = 'USDC'
}

export type CURRENCY_RATES = {
    [key in Currencies]: number
}

export const defaultCurrencyRates: CURRENCY_RATES = {
    ETH: 0,
    USDC: 1
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
