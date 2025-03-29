import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  PasswordInput,
  Select,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { modals } from '@mantine/modals'
import {
  IconEdit,
  IconLock,
  IconSearch,
  IconTrash,
  IconUser,
  IconUserPlus
} from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { HostNameCol, Pagination } from '@/components'
import { FILTER_BY_SEARCH_ACCOUNTS, selectFilteredAccounts } from '@/redux'
import {
  ACCOUNTS_API_URL,
  convertTimestampToDate,
  emailPattern,
  HOSTS_API_URL,
  HUTECH_AFFIX_EMAIL
} from '@/utils'

export const Accounts = () => {
  const [opened, setOpened] = useState(false)
  const [formIsLoading, setFormIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accountsData, setAccountsData] = useState([])
  const filteredAccounts = useSelector(selectFilteredAccounts)
  const [hostsList, setHostsList] = useState([])

  const [search, setSearch] = useState('')
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | null>('10')
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage)
  const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem)

  const [formType, setFormType] = useState<'add' | 'edit'>('add')
  const [docId, setDocId] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('Quản trị viên')

  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    getAllAccounts()
    getAllHosts()
  }, [])

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH_ACCOUNTS({ accounts: accountsData, search }))
    setCurrentPage(1)
  }, [dispatch, accountsData, search])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const pageParam = searchParams.get('page')

    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10)
      setCurrentPage(isNaN(parsedPage) ? 1 : parsedPage)
    } else {
      setCurrentPage(1)
    }
  }, [location.search])

  const getAllAccounts = async () => {
    try {
      const res = await axios.get(`${ACCOUNTS_API_URL}/get-all`)
      if (res.status == 200) {
        setAccountsData(res.data)
      }
    } catch (e: any) {
      console.log('Lỗi lấy dữ liệu: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const getAllHosts = async () => {
    try {
      const res = await axios.get(`${HOSTS_API_URL}/get-all`)
      if (res.status == 200) {
        setHostsList(res.data)
      }
    } catch (e: any) {
      setHostsList([])
      console.log('Lỗi lấy dữ liệu: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAccount = async (e: any) => {
    e.preventDefault()

    if (password.length < 6) {
      window.SweetAlert.warning('Mật khẩu phải có ít nhất 6 ký tự!', '', false)
    } else {
      setFormIsLoading(true)

      let email = username
      if (!emailPattern.test(username)) {
        email += HUTECH_AFFIX_EMAIL
      }

      try {
        const res = await axios.post(`${ACCOUNTS_API_URL}/create`, {
          email: email,
          username: username,
          password: password,
          fullName: fullName,
          roleName: role
        })
        if (res.status == 200) {
          setOpened(false)
          window.SweetAlert.success(
            'Thêm người dùng',
            `Đã thêm người dùng mới ${username} thành công!`,
            false
          )

          resetForm()
        }
      } catch (e: any) {
        window.SweetAlert.error(
          'Lỗi thêm tài khoản',
          `${e.response.data.message}`,
          false
        )
      }

      await getAllAccounts()
      setFormIsLoading(false)
    }
  }

  const editAccount = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    if (password != '') {
      try {
        const res = await axios.post(`${ACCOUNTS_API_URL}/update`, {
          uid: userId,
          username: username,
          password: password,
          fullName: fullName,
          roleName: role
        })
        if (res.status == 200) {
          await updateAccountDoc()
        }
      } catch (e: any) {
        window.SweetAlert.error(
          'Lỗi cập nhật mật khẩu',
          `${e.response.data.message}`,
          false
        )
      }
    } else {
      await updateAccountDoc()
    }
  }

  const updateAccountDoc = async () => {
    window.SweetAlert.success(
      'Cập nhật tài khoản',
      `Đã cập nhật thông tin cho tài khoản ${username} thành công!`,
      false
    )
    await getAllAccounts()
    setFormIsLoading(false)
    setOpened(false)

    resetForm()
  }

  const deleteAccount = (id: string, userId: string, username: string) => {
    modals.openConfirmModal({
      title: 'Xóa tài khoản',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Text>
          Bạn có chắc muốn xóa quyền truy cập vào hệ thống của tài khoản{' '}
          <b>"{username}"</b> không?
        </Text>
      ),
      labels: { confirm: 'Xóa tài khoản', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        try {
          const res = await axios.post(`${ACCOUNTS_API_URL}/delete`, {
            docId: id,
            userId: userId
          })
          if (res.status == 200) {
            window.SweetAlert.success(
              'Xóa tài khoản',
              `Đã xóa tài khoản ${username} thành công!`,
              false
            )
            await getAllAccounts()
          }
        } catch (e: any) {
          window.SweetAlert.error(
            'Lỗi xóa tài khoản',
            `${e.response.data.message}`,
            false
          )
        }
      }
    })
  }

  const resetForm = () => {
    setDocId('')
    setUserId('')
    setUsername('')
    setPassword('')
    setFullName('')
    setRole('Quản trị viên')
  }

  return (
    <>
      <Title order={2}>Danh sách tài khoản</Title>
      <Text>
        Danh sách tài khoản quản trị hệ thống, bạn có thể tạo mới và phân quyền
        các thành viên tại đây.
      </Text>

      {isLoading ? (
        <Loader color="blue" size="xl" type="dots" />
      ) : (
        <>
          <Modal
            opened={opened}
            onClose={() => {
              resetForm()
              setOpened(false)
            }}
            size="55rem"
            title={
              formType == 'add' ? 'Tạo người dùng mới' : 'Thông tin người dùng'
            }
            centered
            removeScrollProps={{ allowPinchZoom: true }}
            closeOnClickOutside={false}
          >
            <form onSubmit={formType == 'add' ? handleAddAccount : editAccount}>
              <Group grow>
                <TextInput
                  label="Tài khoản"
                  placeholder="Username hoặc Email...."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={formIsLoading || formType == 'edit'}
                  required={formType == 'add'}
                  radius="md"
                  leftSection={<IconUser size={18} stroke={1.5} />}
                />
                <PasswordInput
                  label={formType == 'add' ? 'Mật khẩu' : 'Đổi mật khẩu'}
                  placeholder={
                    formType == 'edit' ? 'Nhập vào nếu cần đổi mật khẩu' : ''
                  }
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required={formType == 'add'}
                  disabled={formIsLoading}
                  radius="md"
                  leftSection={<IconLock size={18} stroke={1.5} />}
                />
              </Group>
              <TextInput
                mt="md"
                label="Họ tên"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                disabled={formIsLoading}
                radius="md"
              />
              <Select
                mt="md"
                label="Đơn vị"
                data={[
                  'Quản trị viên',
                  'Cộng tác viên',
                  ...hostsList.map((host: any) => {
                    return { value: host.hostId, label: host.name }
                  })
                ]}
                value={role}
                // @ts-ignore
                onChange={setRole}
                required
                radius="md"
                allowDeselect={false}
                searchable
                nothingFoundMessage="Không tìm thấy đơn vị này..."
                disabled={formIsLoading}
              />
              <Group grow mt="md">
                <Button
                  my="lg"
                  onClick={() => {
                    resetForm()
                    setOpened(false)
                  }}
                  color="red"
                  disabled={formIsLoading}
                >
                  Đóng
                </Button>
                <Button
                  my="lg"
                  color="green"
                  type="submit"
                  loading={formIsLoading}
                >
                  {formType == 'add' ? 'Thêm' : 'Cập nhật'}
                </Button>
              </Group>
            </form>
          </Modal>

          <Button
            my="lg"
            onClick={() => {
              setFormType('add')
              setOpened(true)
            }}
            leftSection={<IconUserPlus size={24} />}
          >
            Thêm tài khoản
          </Button>

          <Group justify="space-between">
            <div>
              <TextInput
                label={
                  <>
                    <b>{filteredAccounts.length}</b> tài khoản
                  </>
                }
                placeholder="Tìm kiếm tài khoản"
                leftSection={<IconSearch stroke={1.5} />}
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
                variant="default"
              />
            </div>

            <Select
              label={`Đang hiển thị ${itemsPerPage} mục`}
              placeholder="Chọn giá trị"
              data={['10', '25', '50', '100']}
              value={itemsPerPage}
              onChange={setItemsPerPage}
              allowDeselect={false}
            />
          </Group>

          {filteredAccounts.length === 0 ? (
            <Text>Không có dữ liệu nào.</Text>
          ) : (
            <>
              <Table.ScrollContainer my="md" minWidth={500} type="native">
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên tài khoản</Table.Th>
                      <Table.Th>Họ tên</Table.Th>
                      <Table.Th>Đơn vị</Table.Th>
                      <Table.Th>Ngày tạo / chỉnh sửa</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentItems.map((account: any, index: any) => {
                      const {
                        id,
                        userId,
                        username,
                        fullName,
                        roleName,
                        createdAt,
                        editedAt
                      } = account

                      return (
                        <Table.Tr key={userId}>
                          <Table.Td>{username}</Table.Td>
                          <Table.Td>{fullName}</Table.Td>
                          <Table.Td>
                            <Badge
                              color={
                                roleName == 'Quản trị viên' ? 'red' : 'blue'
                              }
                              radius="sm"
                            >
                              {roleName !== 'Quản trị viên' &&
                              roleName !== 'Cộng tác viên' ? (
                                <HostNameCol hostId={roleName} />
                              ) : (
                                roleName
                              )}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {editedAt ? (
                              <>{convertTimestampToDate(editedAt)} (Đã sửa)</>
                            ) : (
                              convertTimestampToDate(createdAt)
                            )}
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon.Group>
                              <ActionIcon
                                size="lg"
                                color="green"
                                variant="filled"
                                onClick={() => {
                                  setFormType('edit')
                                  setDocId(id)
                                  setUserId(userId)
                                  setUsername(username)
                                  setFullName(fullName)
                                  setRole(roleName)
                                  setOpened(true)
                                }}
                              >
                                <IconEdit stroke={1.5} />
                              </ActionIcon>
                              <ActionIcon
                                size="lg"
                                color="red"
                                variant="filled"
                                onClick={() =>
                                  deleteAccount(id, userId, username)
                                }
                              >
                                <IconTrash stroke={1.5} />
                              </ActionIcon>
                            </ActionIcon.Group>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              <Center mt="md">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={Number(itemsPerPage)}
                  totalItems={filteredAccounts.length}
                />
              </Center>
            </>
          )}
        </>
      )}
    </>
  )
}
