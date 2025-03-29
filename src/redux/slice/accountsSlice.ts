import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accounts: []
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    STORE_ACCOUNTS(state, action) {
      state.accounts = action.payload.accounts
    }
  }
})

export const { STORE_ACCOUNTS } = accountSlice.actions

export const selectAccounts = (state: any) => state.account.accounts

export const accountReducer = accountSlice.reducer
