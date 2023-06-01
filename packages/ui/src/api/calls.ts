import customAxios from './axios'

import { APP_DETAILS, CHAIN_DETAILS } from 'utils/constants'
import { kycStatus } from 'utils/onfido'
import { CURRENCY_RATES, defaultCurrencyRates } from '../../../common/types'

export const getLatestWorkflowStatusFromOnfido = async (userAddress: string, workflowId: string): Promise<kycStatus> => {
    const response = await customAxios.get(
        CHAIN_DETAILS.KYC_GET_WORKFLOW_DETAILS_BASE_URL +
        `/${userAddress}/${workflowId}/status`
    )
    return response.data.status
}

export const getCurrencyRates = async (): Promise<CURRENCY_RATES> => {
    let rates = { ...defaultCurrencyRates }
    try {
        const response = await customAxios.get(APP_DETAILS.GET_CURRENCY_RATES_URL)
        rates = response.data.rates
    } catch (error) {
        throw (error)
    }
    return rates
}
