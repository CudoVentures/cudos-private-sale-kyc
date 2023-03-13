import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum NftTier {
    Opal = 'Opal',
    Ruby = 'Ruby',
    Emerald = 'Emerald',
    Diamond = 'Diamond',
    BlueDiamond = 'Blue Diamond'
}

export const TIER_PRICES = {
    [NftTier.Opal]: {
        Private: 127.5,
        Public: 150
    },
    [NftTier.Ruby]: {
        Private: 255,
        Public: 300
    },
    [NftTier.Emerald]: {
        Private: 850,
        Public: 1000
    },
    [NftTier.Diamond]: {
        Private: 2550,
        Public: 3000
    },
    [NftTier.BlueDiamond]: {
        Private: 4250,
        Public: 5000
    }
}

export type NftQuantities = {
    [key in NftTier]: number
}

export interface nftTiersState extends NftQuantities {
    limit: number
}

export const initialState: nftTiersState = {
    [NftTier.Opal]: 0,
    [NftTier.Ruby]: 0,
    [NftTier.Emerald]: 0,
    [NftTier.Diamond]: 0,
    [NftTier.BlueDiamond]: 0,
    limit: 0
}

export const nftTiersStateSlice = createSlice({
    name: 'nftTiersState',
    initialState,
    reducers: {
        updateNftTiersState: (state, action: PayloadAction<nftTiersState>) => {
            return { ...state, ...action.payload }
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateNftTiersState } = nftTiersStateSlice.actions

export default nftTiersStateSlice.reducer
