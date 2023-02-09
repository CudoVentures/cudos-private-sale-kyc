import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface modalState {
    title?: string
    message?: string
    msgType?: string
    loading?: boolean
    loadingType?: boolean
    success?: boolean
    failure?: boolean
    changeChosenBalance?: boolean
    dataObject?: Record<string, unknown>
}

export const initialState: modalState = {
    title: '',
    message: '',
    msgType: '',
    loading: false,
    success: false,
    loadingType: false,
    failure: false,
    changeChosenBalance: false,
    dataObject: {}
}

export const modalStateSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    updateModalState: (state, action: PayloadAction<modalState>) => {
      return { ...state, ...action.payload }
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateModalState } = modalStateSlice.actions

export default modalStateSlice.reducer
