import customAxios from './axios'
import axios from 'axios'
import { Currencies, CURRENCY_RATES, defaultCurrencyRates } from 'components/FormField/types'
import { APP_DETAILS, CHAIN_DETAILS } from 'utils/constants'
import { kycStatus } from 'utils/onfido'
import { GET_CURRENCY_RATE_URL } from './endpoints'

export const getLatestWorkflowStatusFromOnfido = async (userAddress: string, workflowId: string): Promise<kycStatus> => {
    const response = await customAxios.get(
        CHAIN_DETAILS.KYC_GET_WORKFLOW_DETAILS_BASE_URL +
        `/${userAddress}/${workflowId}/status`
    )
    return response.data.status
}

const getCurrencyRates = async (fromCurrencies: Currencies[], toCurrency: string): Promise<CURRENCY_RATES> => {
    let rates = { ...defaultCurrencyRates }
    try {
        const response = await axios.get(
            `${GET_CURRENCY_RATE_URL(fromCurrencies.join(','), toCurrency)}`, {
            headers: {
                'authorization': `Apikey ${APP_DETAILS.cryptoCompareApiKey}`,
            }
        })
        type RateData = { USD: number }
        type PriceApiResponse = Record<string, RateData>
        for (const [currency, rate] of Object.entries<PriceApiResponse>(response.data)) {
            rates[currency] = rate.USD
        }
    } catch (error) {
        console.error((error as Error).message)
    }
    return rates
}

export default getCurrencyRates
