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
        Private: 140.25,
        Public: 165
    },
    [NftTier.Ruby]: {
        Private: 280.5,
        Public: 330
    },
    [NftTier.Emerald]: {
        Private: 935,
        Public: 1100
    },
    [NftTier.Diamond]: {
        Private: 2805,
        Public: 3300
    },
    [NftTier.BlueDiamond]: {
        Private: 4675,
        Public: 5500
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
