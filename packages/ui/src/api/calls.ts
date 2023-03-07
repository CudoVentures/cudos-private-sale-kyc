import axios from 'axios'
import { AliasToCurrency, Currencies, CurrencyToAlias, CURRENCY_RATES, defaultCurrencyRates } from 'components/FormField/types'
import { GET_CURRENCY_RATE_URL } from './endpoints'

const getCurrencyRates = async (fromCurrencies: Currencies[], toCurrency: string): Promise<CURRENCY_RATES> => {
    let rates = { ...defaultCurrencyRates }
    try {
        const from = fromCurrencies.map((fromCurrency) => {
            return CurrencyToAlias[fromCurrency]
        }).join(',')
        const response = await axios.get(`${GET_CURRENCY_RATE_URL(from, toCurrency)}`)
        type RateData = { usd: string }
        type PriceApiResponse = Record<string, RateData>
        for (const [alias, rate] of Object.entries<PriceApiResponse>(response.data)) {
            rates[AliasToCurrency[alias]] = Number(rate.usd)
        }
    } catch (error) {
        console.error((error as Error).message)
    }
    return rates
}

export default getCurrencyRates
