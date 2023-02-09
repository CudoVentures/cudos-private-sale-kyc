import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CHAIN_DETAILS } from 'utils/constants'

export const initialRegistrationState: PrivateSaleFields = {
    firstName: '',
    lastName: '',
    amountToSpend: '',
    email: '',
    nftCount: 0,
    externalWaller: ''
}
export interface PrivateSaleFields {
    firstName: string,
    lastName: string,
    amountToSpend: string,
    email: string,
    nftCount: number,
    externalWaller: string,
}

export interface userState {
    address?: string
    accountName?: string
    connectedLedger?: string
    chosenNetwork?: string
    registrationState?: PrivateSaleFields
}

export const initialState: userState = {
    address: '',
    accountName: '',
    connectedLedger: '',
    chosenNetwork: CHAIN_DETAILS.DEFAULT_NETWORK,
    registrationState: initialRegistrationState
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
