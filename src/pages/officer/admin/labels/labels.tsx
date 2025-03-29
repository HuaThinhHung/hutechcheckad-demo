import {
  ActionIcon,
  Badge,
  Button,
  Center,
  ColorInput,
  ColorSwatch,
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
  IconTag,
  IconTags,
  IconTrash
} from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Pagination } from '@/components'
import { FILTER_BY_SEARCH_LABELS, selectFilteredLabels } from '@/redux'
import { convertTimestampToDate, DASHBOARD_LABELS_API_URL } from '@/utils'

export const Labels = () => {
  const [opened, setOpened] = useState(false)
  const [formIsLoading, setFormIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [labelsData, setLabelsData] = useState([])
  const filteredLabels = useSelector(selectFilteredLabels)

  const [search, setSearch] = useState('')
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | null>('10')
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage)
  const currentItems = filteredLabels.slice(indexOfFirstItem, indexOfLastItem)

  const [formType, setFormType] = useState<'add' | 'edit'>('add')
  const [docId, setDocId] = useState('')
  const [name, setName] = useState('')
  const [color, setColor] = useState('#228be6')

  const dispatch = useDispatch()

  useEffect(() => {
    getAllLabels()
  }, [])

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH_LABELS({ labels: labelsData, search }))
    setCurrentPage(1)
  }, [dispatch, labelsData, search])

  const getAllLabels = async () => {
    try {
      const res = await axios.get(`${DASHBOARD_LABELS_API_URL}/get-all`)
      if (res.status == 200) {
        setLabelsData(res.data)
      }
    } catch (e: any) {
      console.log('Lỗi lấy dữ liệu: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLabel = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_LABELS_API_URL}/add`, {
        name: name,
        color: color
      })

      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Thêm chủ đề',
          `Đã thêm chủ đề "${name}" thành công!`,
          false
        )
        resetForm()
        await getAllLabels()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error('Lỗi', 'Nhãn chủ đề này đã tồn tại.', false)
      } else {
        console.log(e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleEditLabel = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_LABELS_API_URL}/add`, {
        docId: docId,
        name: name,
        color: color
      })

      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Cập nhật nhãn',
          `Đã cập nhật nhãn chủ đề thành công!`,
          false
        )
        resetForm()
        await getAllLabels()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error('Lỗi', 'Nhãn chủ đề này đã tồn tại.', false)
      } else {
        console.log(e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const deleteLabel = (docId: string, name: string) => {
    modals.openConfirmModal({
      title: 'Xóa nhãn chủ đề',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Text>
          Bạn có chắc muốn xóa nhãn chủ đề <b>"{name}"</b> không? Nhãn này sẽ
          không còn xuất hiện trên các sự kiện đang sử dụng nó.
        </Text>
      ),
      labels: { confirm: 'Xóa chủ đề', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        await axios.post(`${DASHBOARD_LABELS_API_URL}/delete`, { docId })
        window.SweetAlert.success(
          'Xóa nhãn chủ đề',
          `Đã xóa nhãn chủ đề "${name}" thành công!`,
          false
        )
        await getAllLabels()
      }
    })
  }

  const resetForm = () => {
    setDocId('')
    setName('')
    setColor('#228be6')
  }

  return (
    <>
      <Title order={2}>Danh sách chủ đề</Title>
      <Text>Bạn có thể tạo hoặc xóa chủ đề của sự kiện/hội thảo tại đây.</Text>

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
            title={formType == 'add' ? 'Thêm chủ đề mới' : 'Sửa chủ đề'}
            centered
            removeScrollProps={{ allowPinchZoom: true }}
            closeOnClickOutside={false}
          >
            <form
              onSubmit={formType == 'add' ? handleAddLabel : handleEditLabel}
            >
              <TextInput
                label="Tên chủ đề"
                placeholder=""
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={formIsLoading}
                radius="md"
                leftSection={<IconTag size={18} stroke={1.5} />}
              />
              <ColorInput
                mt="md"
                label="Màu nhãn"
                value={color}
                onChange={setColor}
                format="hex"
                swatches={[
                  '#2e2e2e',
                  '#868e96',
                  '#fa5252',
                  '#e64980',
                  '#be4bdb',
                  '#7950f2',
                  '#4c6ef5',
                  '#228be6',
                  '#15aabf',
                  '#12b886',
                  '#40c057',
                  '#82c91e',
                  '#fab005',
                  '#fd7e14'
                ]}
                required
                disabled={formIsLoading}
              />
              <Center inline mt="md">
                <Text mr="xs">Xem trước:</Text>
                <Badge color={color}>{name}</Badge>
              </Center>
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
            leftSection={<IconTags size={24} />}
          >
            Thêm chủ đề
          </Button>

          <Group justify="space-between">
            <div>
              <Text></Text>
              <TextInput
                label={
                  <>
                    <b>{filteredLabels.length}</b> chủ đề
                  </>
                }
                placeholder="Tìm kiếm chủ đề"
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

          {filteredLabels.length === 0 ? (
            <Text>Không có dữ liệu nào.</Text>
          ) : (
            <>
              <Table.ScrollContainer my="md" minWidth={500} type="native">
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên chủ đề</Table.Th>
                      <Table.Th>Màu nhãn</Table.Th>
                      <Table.Th>Ngày thêm/sửa</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentItems.map((label: any, index: any) => {
                      const { id, name, color, createdAt, editedAt } = label

                      return (
                        <Table.Tr key={id}>
                          <Table.Td>{name}</Table.Td>
                          <Table.Td>
                            <ColorSwatch color={color} />
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
                                  setName(name)
                                  setColor(color)
                                  setOpened(true)
                                }}
                              >
                                <IconEdit stroke={1.5} />
                              </ActionIcon>
                              <ActionIcon
                                size="lg"
                                color="red"
                                variant="filled"
                                onClick={() => deleteLabel(id, name)}
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
                  totalItems={filteredLabels.length}
                />
              </Center>
            </>
          )}
        </>
      )}
    </>
  )
}
