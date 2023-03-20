import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface modalState {
  title?: string
  message?: string | JSX.Element
  loading?: boolean
  loadingType?: boolean
  success?: boolean
  failure?: boolean
  openTOC?: boolean
  data?: any
  selectWallet?: boolean,

}

export const initialState: modalState = {
  title: '',
  message: '',
  loading: false,
  success: false,
  loadingType: false,
  failure: false,
  openTOC: false,
  data: undefined,
  selectWallet: false,
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
