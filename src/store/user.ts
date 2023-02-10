import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SUPPORTED_WALLET } from 'cudosjs'
import { CHAIN_DETAILS } from 'utils/constants'

export const initialRegistrationState: PrivateSaleFields = {
    connectedAddress: '',
    firstName: '',
    lastName: '',
    amountToSpend: '',
    email: '',
    nftCount: '',
    externalWallet: '',
    nftTiers: []
}
export interface PrivateSaleFields {
    connectedAddress: string
    firstName: string,
    lastName: string,
    amountToSpend: string,
    email: string,
    nftCount: string,
    nftTiers: number[],
    externalWallet: string,
}

export interface userState {
    address?: string
    accountName?: string
    connectedLedger?: SUPPORTED_WALLET
    chosenNetwork?: string
    registrationState?: PrivateSaleFields
}

export const initialState: userState = {
    address: '',
    accountName: '',
    connectedLedger: undefined,
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
