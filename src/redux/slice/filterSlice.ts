import { createSlice } from '@reduxjs/toolkit'

import { formatDate } from '@/utils'

const initialState = {
  filteredAccounts: [],
  filteredStudents: [],
  filteredLabels: [],
  filteredHosts: [],
  filteredTemplates: [],
  filteredEvents: [],
  filteredCerts: []
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    FILTER_BY_SEARCH_ACCOUNTS(state, action) {
      const { accounts, search } = action.payload
      const tempAccounts = accounts.filter(
        (account: any) =>
          account.userId.toLowerCase().includes(search.toLowerCase()) ||
          account.username.toLowerCase().includes(search.toLowerCase()) ||
          account.fullName.toLowerCase().includes(search.toLowerCase()) ||
          account.roleName.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredAccounts = tempAccounts
    },
    FILTER_BY_SEARCH_STUDENTS(state, action) {
      const { students, search } = action.payload
      const tempStudents = students.filter(
        (student: any) =>
          student.studentId.toLowerCase().includes(search.toLowerCase()) ||
          student.fullName.toLowerCase().includes(search.toLowerCase()) ||
          student.studyClass.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase()) ||
          student.phone.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredStudents = tempStudents
    },
    FILTER_BY_SEARCH_LABELS(state, action) {
      const { labels, search } = action.payload
      const tempLabels = labels.filter((label: any) =>
        label.name.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredLabels = tempLabels
    },
    FILTER_BY_SEARCH_HOSTS(state, action) {
      const { hosts, search } = action.payload
      const tempHosts = hosts.filter((host: any) =>
        host.name.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredHosts = tempHosts
    },
    FILTER_BY_SEARCH_TEMPLATES(state, action) {
      const { templates, search } = action.payload
      const tempTemplates = templates.filter((template: any) =>
        template.title.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredTemplates = tempTemplates
    },
    FILTER_BY_SEARCH_EVENTS(state, action) {
      const { events, search } = action.payload
      const tempEvents = events.filter((event: any) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredEvents = tempEvents
    },
    FILTER_BY_SEARCH_CERTS(state, action) {
      const { certs, search } = action.payload
      const tempCerts = certs.filter(
        (cert: any) =>
          cert.evData.title.toLowerCase().includes(search.toLowerCase()) ||
          cert.certId.toLowerCase().includes(search.toLowerCase()) ||
          formatDate(cert.evData.date)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          cert.checkinAt.toLowerCase().includes(search.toLowerCase()) ||
          cert.studentId.toLowerCase().includes(search.toLowerCase()) ||
          cert.stData.fullName.toLowerCase().includes(search.toLowerCase()) ||
          cert.stData.studyClass.toLowerCase().includes(search.toLowerCase())
      )

      state.filteredCerts = tempCerts
    }
  }
})

export const {
  FILTER_BY_SEARCH_ACCOUNTS,
  FILTER_BY_SEARCH_STUDENTS,
  FILTER_BY_SEARCH_LABELS,
  FILTER_BY_SEARCH_HOSTS,
  FILTER_BY_SEARCH_TEMPLATES,
  FILTER_BY_SEARCH_EVENTS,
  FILTER_BY_SEARCH_CERTS
} = filterSlice.actions

export const selectFilteredAccounts = (state: any) =>
  state.filter.filteredAccounts
export const selectFilteredStudents = (state: any) =>
  state.filter.filteredStudents
export const selectFilteredLabels = (state: any) => state.filter.filteredLabels
export const selectFilteredHosts = (state: any) => state.filter.filteredHosts
export const selectFilteredTemplates = (state: any) =>
  state.filter.filteredTemplates
export const selectFilteredEvents = (state: any) => state.filter.filteredEvents
export const selectFilteredCerts = (state: any) => state.filter.filteredCerts

export const filterReducer = filterSlice.reducer
