import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Select,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { modals } from '@mantine/modals'
import {
  IconEdit,
  IconSearch,
  IconTrash,
  IconUsersPlus
} from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Pagination } from '@/components'
import { FILTER_BY_SEARCH_HOSTS, selectFilteredHosts } from '@/redux'
import { ACCOUNTS_API_URL, HOSTS_API_URL } from '@/utils'

export const Hosts = () => {
  const [opened, setOpened] = useState(false)
  const [formIsLoading, setFormIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hostsData, setHostsData] = useState([])
  const filteredHosts = useSelector(selectFilteredHosts)

  const [search, setSearch] = useState('')
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | null>('10')
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage)
  const currentItems = filteredHosts.slice(indexOfFirstItem, indexOfLastItem)

  const [formType, setFormType] = useState<'add' | 'edit'>('add')
  const [docId, setDocId] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    getAllHosts()
  }, [])

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH_HOSTS({ hosts: hostsData, search }))
    setCurrentPage(1)
  }, [dispatch, hostsData, search])

  const getAllHosts = async () => {
    try {
      const res = await axios.get(`${HOSTS_API_URL}/get-all`)
      if (res.status == 200) {
        setHostsData(res.data)
      }
    } catch (e: any) {
      setHostsData([])
      console.log('Lỗi lấy dữ liệu: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddHost = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${HOSTS_API_URL}/add`, {
        name: name,
        symbol: symbol
      })

      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Thêm đơn vị',
          `Đã thêm đơn vị "${name}" thành công!`,
          false
        )
        resetForm()
        await getAllHosts()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error('Lỗi', 'Đơn vị này đã tồn tại.', false)
      } else {
        console.log(e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleEditHost = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${HOSTS_API_URL}/update`, {
        docId: docId,
        name: name,
        symbol: symbol
      })

      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Cập nhật đơn vị',
          `Đã cập nhật đơn vị thành công!`,
          false
        )
        resetForm()
        await getAllHosts()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error('Lỗi', 'Đơn vị này đã tồn tại.', false)
      } else {
        console.log(e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const findAndDeleteAccount = async (hostId: string) => {
    const docsSnap = (
      await axios.get(`${ACCOUNTS_API_URL}/find-by-role?roleName=${hostId}`)
    ).data

    const docsLength = docsSnap.length
    let accountDeleted = 0

    if (docsLength > 0) {
      await axios.post(`${HOSTS_API_URL}/find-and-delete-all-info`, {
        hostId,
        accounts: docsSnap
      })

      const removeListener = docsSnap.map(async (acc: any) => {
        const res = await axios.post(`${ACCOUNTS_API_URL}/delete`, {
          docId: acc.userId,
          userId: acc.userId
        })
        if (res.status == 200) {
          accountDeleted += 1
        }
      })

      await Promise.all(removeListener)
    }

    return { accountDeleted, docsLength }
  }

  const deleteHost = (docId: string, name: string) => {
    modals.openConfirmModal({
      title: 'Xóa đơn vị',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Text>
          Bạn có chắc muốn xóa đơn vị <b>"{name}"</b> không? Các tài khoản liên
          quan được cấp đơn vị này sẽ bị xóa vĩnh viễn.
        </Text>
      ),
      labels: { confirm: 'Xóa đơn vị', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        window.SweetAlert.info(
          'Xóa đơn vị',
          `Đang tiến hành việc xóa đơn vị "${name}" và các thông tin liên quan......`,
          true
        )
        const { accountDeleted, docsLength } = await findAndDeleteAccount(docId)
        await axios.post(`${HOSTS_API_URL}/delete`, { docId })
        window.SweetAlert.success(
          'Xóa đơn vị',
          `Đã xóa đơn vị "${name}", và ${accountDeleted}/${docsLength} tài khoản liên quan thành công!`,
          false
        )
        await getAllHosts()
      }
    })
  }

  const resetForm = () => {
    setDocId('')
    setName('')
    setSymbol('')
  }

  return (
    <>
      <Title order={2}>Danh sách các đơn vị</Title>
      <Text>Danh sách các quyền hạn cho đơn vị sử dụng hệ thống.</Text>

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
            title={formType == 'add' ? 'Thêm đơn vị mới' : 'Sửa đơn vị'}
            centered
            removeScrollProps={{ allowPinchZoom: true }}
            closeOnClickOutside={false}
          >
            <form onSubmit={formType == 'add' ? handleAddHost : handleEditHost}>
              <TextInput
                label="Tên đơn vị"
                placeholder="Khoa CNTT"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={formIsLoading}
                radius="md"
              />
              <TextInput
                mt="md"
                label="Viết tắt"
                description={
                  <>
                    Tên viết tắt này sẽ được hiển thị trên giấy chứng nhận.
                    <br />
                    Ví dụ: 613831/CN2324<u>CNTT</u>
                  </>
                }
                placeholder="CNTT"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                required
                disabled={formIsLoading}
                radius="md"
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
            leftSection={<IconUsersPlus size={24} />}
          >
            Thêm đơn vị
          </Button>

          <Group justify="space-between">
            <div>
              <TextInput
                label={
                  <>
                    <b>{filteredHosts.length}</b> đơn vị
                  </>
                }
                placeholder="Tìm kiếm đơn vị"
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

          {filteredHosts.length === 0 ? (
            <Text>Không có dữ liệu nào.</Text>
          ) : (
            <>
              <Table.ScrollContainer my="md" minWidth={500} type="native">
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên đơn vị</Table.Th>
                      <Table.Th>Viết tắt</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentItems.map((host: any, index: any) => {
                      const { id, hostId, name, symbol, createdAt, editedAt } =
                        host

                      return (
                        <Table.Tr key={id}>
                          <Table.Td>{name}</Table.Td>
                          <Table.Td>{symbol}</Table.Td>
                          <Table.Td>
                            <ActionIcon.Group>
                              <ActionIcon
                                size="lg"
                                color="green"
                                variant="filled"
                                onClick={() => {
                                  setFormType('edit')
                                  setDocId(id)
                                  setName(name)
                                  setSymbol(symbol)
                                  setOpened(true)
                                }}
                              >
                                <IconEdit stroke={1.5} />
                              </ActionIcon>
                              <ActionIcon
                                size="lg"
                                color="red"
                                variant="filled"
                                onClick={() => deleteHost(id, name)}
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
                  totalItems={filteredHosts.length}
                />
              </Center>
            </>
          )}
        </>
      )}
    </>
  )
}
