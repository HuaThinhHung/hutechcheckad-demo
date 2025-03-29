import { combineReducers, configureStore } from '@reduxjs/toolkit'

import {
  accountReducer,
  authReducer,
  certReducer,
  eventReducer,
  filterReducer,
  hostReducer,
  labelReducer,
  studentReducer,
  templateReducer
} from './slice'

const rootReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  student: studentReducer,
  label: labelReducer,
  host: hostReducer,
  template: templateReducer,
  event: eventReducer,
  cert: certReducer,
  filter: filterReducer
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
