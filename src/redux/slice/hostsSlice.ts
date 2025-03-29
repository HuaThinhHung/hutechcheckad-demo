import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hosts: []
}

const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    STORE_HOSTS(state, action) {
      state.hosts = action.payload.hosts
    }
  }
})

export const { STORE_HOSTS } = hostSlice.actions

export const selectHosts = (state: any) => state.host.hosts

export const hostReducer = hostSlice.reducer
