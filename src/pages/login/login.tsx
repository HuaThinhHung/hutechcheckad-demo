import {
  Button,
  Container,
  Modal,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core'
import { IconLock, IconUser } from '@tabler/icons-react'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { SET_ACTIVE_USER } from '@/redux'
import {
  DASHBOARD_AUTH_API_URL,
  emailPattern,
  HUTECH_AFFIX_EMAIL
} from '@/utils'

import classes from './login.module.css'

export const Login = () => {
  const [opened, setOpened] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const handleLoginWithOfficer = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    let email = username
    if (!emailPattern.test(username)) {
      email += HUTECH_AFFIX_EMAIL
    }

    try {
      const response = await axios.post(`${DASHBOARD_AUTH_API_URL}/login`, {
        email,
        password
      })

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)

        dispatch(
          SET_ACTIVE_USER({
            email: response.data.user.email,
            fullName: response.data.user.fullName,
            userID: response.data.user.userID,
            roleName: response.data.user.roleName
          })
        )

        window.SweetAlert.success('Đăng nhập thành công', '', false)
        window.location.href = '/'
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message)
    }
    setIsLoading(false)
  }

  const openSignInModal = () => {
    setOpened(true)
  }

  const resetForm = () => {
    setUsername('')
    setPassword('')
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title} mb={30}>
        Chào mừng!
      </Title>

      <Modal
        opened={opened}
        onClose={() => {
          resetForm()
          setOpened(false)
        }}
        title="Đăng nhập"
        centered
        closeOnClickOutside={false}
        removeScrollProps={{ allowPinchZoom: true }}
      >
        <form onSubmit={handleLoginWithOfficer}>
          <TextInput
            label="Tài khoản"
            placeholder="Tên tài khoản"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={isLoading}
            radius="md"
            leftSection={<IconUser size={18} stroke={1.5} />}
          />
          <PasswordInput
            mt="md"
            label="Mật khẩu"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
            radius="md"
            leftSection={<IconLock size={18} stroke={1.5} />}
          />

          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Đăng nhập
          </Button>
        </form>
      </Modal>

      <Button fullWidth size="md" onClick={openSignInModal}>
        Đăng nhập
      </Button>
    </Container>
  )
}
