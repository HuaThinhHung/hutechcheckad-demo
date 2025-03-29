import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  templates: []
}

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    STORE_TEMPLATES(state, action) {
      state.templates = action.payload.templates
    }
  }
})

export const { STORE_TEMPLATES } = templateSlice.actions

export const selectTemplates = (state: any) => state.template.templates

export const templateReducer = templateSlice.reducer
