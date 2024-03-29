import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Currencies } from '../../../common/types'
import { SUPPORTED_WALLET } from 'cudosjs'

export interface NftTier {
    qty: number,
    cost: number
}

export const initialRegistrationState: PrivateSaleFields = {
    connectedAddress: '',
    firstName: '',
    lastName: '',
    amountToSpend: '',
    amountToSpendUsd: '',
    chosenCurrency: undefined,
    email: '',
    nftCount: '',
    payerWalletAddress: '',
    nftTiers: {},
    tocAgreed: false,
    kycWorkflowRunId: undefined,
    kycStatus: undefined,
    kycApplicantId: undefined,
    processCompleted: false
}
export interface PrivateSaleFields {
    connectedAddress: string
    firstName: string,
    lastName: string,
    amountToSpend: string,
    amountToSpendUsd: string,
    chosenCurrency: Currencies | undefined,
    email: string,
    nftCount: string,
    nftTiers: Record<string, NftTier>,
    payerWalletAddress: string,
    tocAgreed: boolean,
    kycWorkflowRunId: string | undefined,
    kycStatus: string | undefined,
    kycApplicantId: string | undefined,
    processCompleted: boolean
}

export interface userState {
    address?: string
    accountName?: string
    connectedLedger?: SUPPORTED_WALLET
    registrationState?: PrivateSaleFields
}

export const initialState: userState = {
    address: '',
    accountName: '',
    connectedLedger: undefined,
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
