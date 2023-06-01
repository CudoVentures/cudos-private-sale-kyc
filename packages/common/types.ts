export type AUTH_HEADERS = {
    headers: {
        authorization: string
    }
}

export enum Currencies {
    ETH = 'ETH',
    USDC = 'USDC',
    USDT = 'USDT',
    SOL = 'SOL',
    CUDOS = 'CUDOS'
}

export type CURRENCY_RATES = {
    [key in Currencies]: number
}

export const defaultCurrencyRates: CURRENCY_RATES = {
    ETH: 0,
    USDC: 0,
    USDT: 0,
    SOL: 0,
    CUDOS: 0
}
