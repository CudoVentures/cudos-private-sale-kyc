import { Coin } from 'cudosjs'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CHAIN_DETAILS } from 'utils/constants'

export interface userState {
    address?: string
    isAdmin?: boolean
    accountName?: string
    nativeBalance?: string
    balances?: readonly Coin[]
    chosenBalance?: Coin
    connectedLedger?: string
    chosenNetwork?: string
}

export const initialState: userState = {
    address: '',
    isAdmin: false,
    accountName: '',
    nativeBalance: '',
    balances: [],
    chosenBalance: { denom: '', amount: '' },
    connectedLedger: '',
    chosenNetwork: CHAIN_DETAILS.DEFAULT_NETWORK
}

export const userStateSlice = createSlice({
    name: 'userState',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<userState>) => {
            return { ...state, ...action.payload }
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateUser } = userStateSlice.actions

export default userStateSlice.reducer
