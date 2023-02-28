import axios from 'axios'
import { Currencies, CURRENCY_RATES, defaultCurrencyRates } from 'components/FormField/types'
import { GET_CURRENCY_RATE_URL } from './endpoints'

const getCurrencyRates = async (fromCurrency: string, toCurrencies: Currencies[]): Promise<CURRENCY_RATES> => {
    let rates = { ...defaultCurrencyRates }
    try {
        const response = await axios.get(`${GET_CURRENCY_RATE_URL(fromCurrency, toCurrencies.join(','))}`)
        const fetchedRates = response.data[fromCurrency.toLowerCase()]
        for (const [currency, rate] of Object.entries(fetchedRates)) {
            if (currency.toUpperCase() !== Currencies.USDC) {
                rates[currency.toUpperCase()] = Number(rate)
            }
        }
    } catch (error) {
        console.error((error as Error).message)
    }
    return rates
}

export default getCurrencyRates
