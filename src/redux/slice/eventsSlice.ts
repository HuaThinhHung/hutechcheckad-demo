import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  events: []
}

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    STORE_EVENTS(state, action) {
      state.events = action.payload.events
    }
  }
})

export const { STORE_EVENTS } = eventSlice.actions

export const selectEvents = (state: any) => state.event.events

export const eventReducer = eventSlice.reducer
