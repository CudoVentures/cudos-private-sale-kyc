import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Currencies, CURRENCY_RATES, defaultCurrencyRates } from '../../../common/types'

export interface ratesState {
    fetchedAt?: Date,
    chosenCurrency?: Currencies
    currencyRates?: CURRENCY_RATES
}

export const initialState: ratesState = {
    fetchedAt: undefined,
    chosenCurrency: undefined,
    currencyRates: defaultCurrencyRates,
}

export const userStateSlice = createSlice({
    name: 'ratesState',
    initialState,
    reducers: {
        updateRates: (state, action: PayloadAction<ratesState>) => {
            return { ...state, ...action.payload }
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateRates } = userStateSlice.actions

export default userStateSlice.reducer
