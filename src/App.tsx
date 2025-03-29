import { Center, Loader } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppProvider } from '@/AppProvider'
import { Layout as LayoutOfficer, SweetAlertContainer } from '@/components'
import {
  Accounts,
  Certs,
  Configuration,
  EventInfo,
  Events,
  Hosts,
  Labels,
  Login,
  OfficerHome,
  PageNotFound,
  Students,
  TemplateInfo,
  Templates
} from '@/pages'
import { REMOVE_ACTIVE_USER, selectRoleName, SET_ACTIVE_USER } from '@/redux'
import { DASHBOARD_AUTH_API_URL, HOSTS_API_URL } from '@/utils'

function App() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const dispatch = useDispatch()

  const roleName = useSelector(selectRoleName)

  const checkSession = async () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      // @ts-ignore
      dispatch(REMOVE_ACTIVE_USER())
      setIsLoggedIn(false)
    } else {
      try {
        const response = await axios.get(
          `${DASHBOARD_AUTH_API_URL}/check-session`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (response.data.user) {
          const roleName = await getRole(response.data.user.roleId)

          dispatch(
            SET_ACTIVE_USER({
              email: response.data.user.email,
              fullName: response.data.user.fullName,
              userID: response.data.user.userID,
              roleId: response.data.user.roleId,
              roleName: roleName
            })
          )
          setIsLoggedIn(true)
        } else {
          // @ts-ignore
          dispatch(REMOVE_ACTIVE_USER())
          setIsLoggedIn(false)
        }
      } catch (error) {
        // @ts-ignore
        dispatch(REMOVE_ACTIVE_USER())
        setIsLoggedIn(false)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    checkSession()
  }, [])

  const getRole = async (roleName: string) => {
    let role = roleName

    if (role !== 'Quản trị viên' && role !== 'Cộng tác viên') {
      const hostName = await axios.get(
        `${HOSTS_API_URL}/get-name-by-id?hostId=${roleName}`
      )
      return hostName
    }

    return role
  }

  return (
    <>
      <SweetAlertContainer />

      <AppProvider>
        <HashRouter>
          {loading ? (
            <Center h="100vh">
              <Loader color="blue" size="xl" type="bars" />
            </Center>
          ) : !isLoggedIn ? (
            <Routes>
              {/* Chưa đăng nhập */}
              <>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            </Routes>
          ) : (
            <LayoutOfficer>
              {/* Đã đăng nhập với tư cách Cán bộ */}
              <Routes>
                <>
                  <Route path="/login" element={<Navigate to="/" />} />

                  <Route path="/" element={<OfficerHome.Home />} />

                  {roleName != null && roleName == 'Quản trị viên' && (
                    <>
                      <Route path="/accounts" element={<Accounts />} />
                      <Route path="/hosts" element={<Hosts />} />
                      <Route
                        path="/configuration"
                        element={<Configuration />}
                      />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/templates/:id" element={<TemplateInfo />} />
                      <Route path="/labels" element={<Labels />} />

                      <Route path="*" element={<PageNotFound />} />
                    </>
                  )}

                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventInfo />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/certs" element={<Certs />} />

                  <Route path="*" element={<PageNotFound />} />
                </>
              </Routes>
            </LayoutOfficer>
          )}
        </HashRouter>
      </AppProvider>
    </>
  )
}

export default App
