import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  labels: []
}

const labelSlice = createSlice({
  name: 'label',
  initialState,
  reducers: {
    STORE_LABELS(state, action) {
      state.labels = action.payload.labels
    }
  }
})

export const { STORE_LABELS } = labelSlice.actions

export const selectLabels = (state: any) => state.label.labels

export const labelReducer = labelSlice.reducer
