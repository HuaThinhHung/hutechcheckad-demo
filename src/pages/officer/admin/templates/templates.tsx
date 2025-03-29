import {
  ActionIcon,
  Button,
  Center,
  Group,
  Image,
  Loader,
  Select,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { modals } from '@mantine/modals'
import {
  IconEdit,
  IconPhotoPlus,
  IconSearch,
  IconTrash
} from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Pagination } from '@/components'
import { FILTER_BY_SEARCH_TEMPLATES, selectFilteredTemplates } from '@/redux'
import { convertTimestampToDate, DASHBOARD_TEMPLATES_API_URL } from '@/utils'

export const Templates = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [templatesData, setTemplatesData] = useState([])
  const filteredTemplates = useSelector(selectFilteredTemplates)

  const [search, setSearch] = useState('')
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | null>('10')
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage)
  const currentItems = filteredTemplates.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const dispatch = useDispatch()

  useEffect(() => {
    getAllLabels()
  }, [])

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH_TEMPLATES({ templates: templatesData, search }))
    setCurrentPage(1)
  }, [dispatch, templatesData, search])

  const getAllLabels = async () => {
    try {
      const res = await axios.get(`${DASHBOARD_TEMPLATES_API_URL}/get-all`)
      if (res.status == 200) {
        setTemplatesData(res.data)
      }
    } catch (e: any) {
      console.log('Lỗi lấy dữ liệu: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTemplate = (id: string, title: string, imageURL: string) => {
    modals.openConfirmModal({
      title: 'Xóa mẫu chứng nhận',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Text>
          Bạn có chắc muốn xóa mẫu chứng nhận <b>"{title}"</b> không?
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        await handleDeleteTemplate(id, title, imageURL)
      }
    })
  }

  const handleDeleteTemplate = async (
    id: string,
    title: string,
    imageURL: string
  ) => {
    window.SweetAlert.info(
      '',
      `Tính năng này tạm thời đang được bảo trì!`,
      true
    )
    // try {
    //   await deleteDoc(doc(db, "templates", id));
    //
    //   const storageRef = ref(storage, imageURL);
    //   await deleteObject(storageRef);
    // } catch (error: any) {
    //   window.SweetAlert.error(
    //     'Xóa mẫu chứng nhận',
    //     `Đã xảy ra lỗi: ${error.message}`,
    //     false
    //   )
    // }
  }

  return (
    <>
      <Title order={2}>Danh sách mẫu chứng nhận</Title>
      <Text>Mẫu in chứng nhận cho sinh viên.</Text>

      <Button
        my="lg"
        component="a"
        href="#/templates/NEW"
        leftSection={<IconPhotoPlus size={24} />}
      >
        Thêm mẫu chứng nhận
      </Button>

      <Group justify="space-between">
        <div>
          <TextInput
            label={
              <>
                <b>{filteredTemplates.length}</b> mẫu chứng nhận
              </>
            }
            placeholder="Tìm kiếm chứng nhận"
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

      {isLoading ? (
        <Loader color="blue" size="xl" type="dots" />
      ) : (
        <>
          {filteredTemplates.length === 0 ? (
            <Text>Không có dữ liệu nào.</Text>
          ) : (
            <>
              <Table.ScrollContainer my="md" minWidth={500} type="native">
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên chứng nhận</Table.Th>
                      <Table.Th>Hình mẫu</Table.Th>
                      <Table.Th>Ngày thêm/sửa</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentItems.map((template: any, index: any) => {
                      const { id, title, image, createdAt, editedAt } = template

                      return (
                        <Table.Tr key={id}>
                          <Table.Td>{title}</Table.Td>
                          <Table.Td>
                            <Image radius="md" src={image} w={220} />
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
                              <ActionIcon<'a'>
                                size="lg"
                                component="a"
                                color="green"
                                variant="filled"
                                href={`/#/templates/${id}`}
                              >
                                <IconEdit stroke={1.5} />
                              </ActionIcon>
                              <ActionIcon
                                size="lg"
                                color="red"
                                variant="filled"
                                onClick={() => deleteTemplate(id, title, image)}
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
                  totalItems={filteredTemplates.length}
                />
              </Center>
            </>
          )}
        </>
      )}
    </>
  )
}
