import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  students: []
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    STORE_STUDENTS(state, action) {
      state.students = action.payload.students
    }
  }
})

export const { STORE_STUDENTS } = studentSlice.actions

export const selectStudents = (state: any) => state.student.students

export const studentReducer = studentSlice.reducer
