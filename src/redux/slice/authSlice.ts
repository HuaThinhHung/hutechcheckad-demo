import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  email: null,
  fullName: null,
  userID: null,
  roleId: null,
  roleName: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action) => {
      const { email, fullName, userID, roleId, roleName } = action.payload
      state.isLoggedIn = true
      state.email = email
      state.fullName = fullName
      state.userID = userID
      state.roleId = roleId
      state.roleName = roleName
    },
    REMOVE_ACTIVE_USER(state, action) {
      state.isLoggedIn = false
      state.email = null
      state.fullName = null
      state.userID = null
      state.roleId = null
      state.roleName = null
    }
  }
})

export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions

export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn
export const selectEmail = (state: any) => state.auth.email
export const selectFullName = (state: any) => state.auth.fullName
export const selectUserID = (state: any) => state.auth.userID
export const selectRoleId = (state: any) => state.auth.roleId
export const selectRoleName = (state: any) => state.auth.roleName

export const authReducer = authSlice.reducer
