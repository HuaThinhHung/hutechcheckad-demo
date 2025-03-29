import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  certs: []
}

const certSlice = createSlice({
  name: 'cert',
  initialState,
  reducers: {
    STORE_CERTS(state, action) {
      state.certs = action.payload.certs
    }
  }
})

export const { STORE_CERTS } = certSlice.actions

export const selectCerts = (state: any) => state.cert.certs

export const certReducer = certSlice.reducer
