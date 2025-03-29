import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Grid,
  Group,
  Image,
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
  IconAt,
  IconDeviceMobile,
  IconEdit,
  IconId,
  IconIdBadge2,
  IconSchool,
  IconSearch,
  IconTrash,
  IconUserPlus
} from '@tabler/icons-react'
import axios from 'axios'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Pagination } from '@/components'
import {
  FILTER_BY_SEARCH_STUDENTS,
  selectFilteredStudents,
  selectRoleName
} from '@/redux'
import {
  DASHBOARD_CERTS_API_URL,
  DASHBOARD_CONFIG_API_URL,
  DASHBOARD_STUDENTS_API_URL
} from '@/utils'

export const Students = () => {
  const [opened, setOpened] = useState(false)
  const [formIsLoading, setFormIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [studentsData, setStudentsData] = useState([])
  const filteredStudents = useSelector(selectFilteredStudents)

  const [search, setSearch] = useState('')
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | null>('10')
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage)
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)

  const roleName = useSelector(selectRoleName)

  const [formType, setFormType] = useState<'add' | 'edit'>('add')
  const [studentId, setStudentId] = useState<string>('')
  const [fullName, setFullName] = useState('')
  const [studyClass, setStudyClass] = useState('')
  const [isMonitor, setIsMonitor] = useState<boolean>(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    getAllStudents()
  }, [])

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH_STUDENTS({ students: studentsData, search }))
    setCurrentPage(1)
  }, [dispatch, studentsData, search])

  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${DASHBOARD_STUDENTS_API_URL}/get-all`)
      if (res.status == 200) {
        setStudentsData(res.data)
      }
    } catch (e: any) {
      setStudentsData([])
      console.log('Lỗi lấy dữ liệu: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const checkStudentId = async () => {
    const studentIdPattern = (
      await axios.get(`${DASHBOARD_CONFIG_API_URL}/get-student-id-pattern`)
    ).data

    if (studentIdPattern != '') {
      return new RegExp(studentIdPattern.slice(1, -1)).test(studentId)
    } else {
      return true
    }
  }

  const checkExistStudentId = async () => {
    const isExist = (
      await axios.get(
        `${DASHBOARD_STUDENTS_API_URL}/check-exist-student-id?studentId=${studentId}`
      )
    ).data.value

    return isExist
  }

  const handleAddStudent = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    const validStudentId = await checkStudentId()
    const existStudentId = await checkExistStudentId()

    if (validStudentId && !existStudentId) {
      try {
        const res = await axios.post(`${DASHBOARD_STUDENTS_API_URL}/add`, {
          studentId: studentId,
          fullName: fullName,
          studyClass: studyClass,
          isMonitor: isMonitor,
          email: email,
          phone: phone
        })
        if (res.status == 200) {
          setOpened(false)
          window.SweetAlert.success(
            'Thêm sinh viên',
            `Đã thêm sinh viên mới với MSSV ${studentId} thành công!`,
            false
          )
          resetForm()
          await getAllStudents()
        }
      } catch (e: any) {
        console.error('Lỗi thêm sinh viên:', e)
      } finally {
        setFormIsLoading(false)
      }
    } else if (!validStudentId) {
      setFormIsLoading(false)
      window.SweetAlert.error(
        'Kiểm tra SV',
        'Mã số sinh viên không hợp lệ.',
        false
      )
    } else if (existStudentId) {
      setFormIsLoading(false)
      window.SweetAlert.error(
        'Kiểm tra SV',
        'Đã tồn tại sinh viên với MSSV này.',
        false
      )
    } else {
      setFormIsLoading(false)
      window.SweetAlert.error(
        'Kiểm tra SV',
        'Đã xảy ra lỗi trong khi kiểm tra thông tin sinh viên.',
        false
      )
    }
  }

  const handleEditStudent = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_STUDENTS_API_URL}/add`, {
        studentId: studentId,
        fullName: fullName,
        studyClass: studyClass,
        isMonitor: isMonitor,
        email: email,
        phone: phone
      })
      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Cập nhật sinh viên',
          `Đã cập nhật thông tin cho sinh viên MSSV ${studentId} thành công!`,
          false
        )
        resetForm()
        await getAllStudents()
      }
    } catch (e: any) {
      console.error('Lỗi sửa sinh viên:', e)
    } finally {
      setFormIsLoading(false)
    }
  }

  const findAndDeleteCerts = async (stId: string) => {
    const docsSnap = (
      await axios.get(
        `${DASHBOARD_CERTS_API_URL}/find-by-student-id?stId=${stId}`
      )
    ).data

    const docsLength = docsSnap.length
    let certDeleted = 0

    if (docsLength > 0) {
      const removeListener = docsSnap.map(async (cert: any) => {
        certDeleted += 1
        await axios.post(`${DASHBOARD_CERTS_API_URL}/delete`, {
          docId: cert.id
        })
      })

      await Promise.all(removeListener)
    }

    return { certDeleted, docsLength }
  }

  const deleteStudent = (studentId: string, fullName: string) => {
    modals.openConfirmModal({
      title: 'Xóa sinh viên',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Text>
          Bạn có chắc muốn xóa thông tin của sinh viên{' '}
          <b>
            "{studentId.slice(-4)}_{fullName}"
          </b>{' '}
          không? Sinh viên này sẽ không thể xem các hoạt động của mình được nữa.
        </Text>
      ),
      labels: { confirm: 'Xóa sinh viên', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        const { certDeleted, docsLength } = await findAndDeleteCerts(studentId)
        await axios.post(`${DASHBOARD_STUDENTS_API_URL}/delete`, { studentId })
        window.SweetAlert.success(
          'Xóa sinh viên',
          `Đã xóa sinh viên ${studentId.slice(-4)}_${fullName}, và ${certDeleted}/${docsLength} chứng nhận của sinh viên này thành công!`,
          false
        )
        await getAllStudents()
      }
    })
  }

  const resetForm = () => {
    setStudentId('')
    setFullName('')
    setStudyClass('')
    setIsMonitor(false)
    setEmail('')
    setPhone('')
  }

  const showStudentQr = async (studentId: string, studentName: string) => {
    const qr = await QRCode.toDataURL(studentId, {
      version: 2,
      errorCorrectionLevel: 'H',
      margin: 1
    })

    modals.open({
      title: 'Thẻ sinh viên',
      centered: true,
      children: (
        <Grid>
          <Grid.Col span={4}>
            <Image
              radius="md"
              src={qr}
              fallbackSrc="https://placehold.co/100x100?text=Vui+lòng+đợi"
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Title order={4} c="blue">
              THẺ SINH VIÊN
            </Title>
            <Text fw={700} my="xs">
              Họ tên: {studentName}
            </Text>
            <Text>
              <b>MSSV:</b> {studentId}
            </Text>
          </Grid.Col>
        </Grid>
      )
    })
  }

  return (
    <>
      <Title order={2}>Danh sách sinh viên</Title>
      <Text>
        Bạn có thể tra cứu thông tin và các sự kiện mà sinh viên đó tham gia tại
        đây.
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
              formType == 'add' ? 'Thêm sinh viên mới' : 'Thông tin sinh viên'
            }
            centered
            removeScrollProps={{ allowPinchZoom: true }}
            closeOnClickOutside={false}
          >
            <form
              onSubmit={
                formType == 'add' ? handleAddStudent : handleEditStudent
              }
            >
              <Group grow>
                <TextInput
                  label="MSSV"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  disabled={formIsLoading || formType == 'edit'}
                  required={formType == 'add'}
                  radius="md"
                  leftSection={<IconId size={18} stroke={1.5} />}
                />
                <TextInput
                  label="Họ tên"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  radius="md"
                  disabled={formIsLoading}
                />
              </Group>
              <TextInput
                mt="md"
                label="Lớp học"
                value={studyClass}
                onChange={e => setStudyClass(e.target.value)}
                required
                radius="md"
                leftSection={<IconSchool size={18} stroke={1.5} />}
                disabled={formIsLoading}
              />
              <Checkbox
                mt="md"
                checked={isMonitor}
                onChange={event => setIsMonitor(event.currentTarget.checked)}
                label="Là ban cán sự lớp"
                disabled={formIsLoading}
              />
              <Group grow mt="md">
                <TextInput
                  label="Địa chỉ Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  radius="md"
                  leftSection={<IconAt size={18} stroke={1.5} />}
                  disabled={formIsLoading}
                />
                <TextInput
                  label="Số điện thoại"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  radius="md"
                  leftSection={<IconDeviceMobile size={18} stroke={1.5} />}
                  disabled={formIsLoading}
                />
              </Group>
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
            Thêm sinh viên
          </Button>

          <Group justify="space-between">
            <div>
              <TextInput
                label={
                  <>
                    <b>{filteredStudents.length}</b> sinh viên
                  </>
                }
                placeholder="Tìm kiếm sinh viên"
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

          {filteredStudents.length === 0 ? (
            <Text>Không có dữ liệu nào.</Text>
          ) : (
            <>
              <Table.ScrollContainer my="md" minWidth={500} type="native">
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>MSSV</Table.Th>
                      <Table.Th>Họ tên</Table.Th>
                      <Table.Th>Lớp</Table.Th>
                      <Table.Th>BCS</Table.Th>
                      <Table.Th>Điện thoại</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentItems.map((student: any, index: any) => {
                      const {
                        id,
                        studentId,
                        fullName,
                        studyClass,
                        isMonitor,
                        email,
                        phone,
                        createdAt,
                        editedAt
                      } = student

                      return (
                        <Table.Tr key={studentId}>
                          <Table.Td>{studentId}</Table.Td>
                          <Table.Td>{fullName}</Table.Td>
                          <Table.Td>{studyClass}</Table.Td>
                          <Table.Td>
                            {isMonitor && (
                              <Checkbox
                                checked={isMonitor}
                                onChange={() => {}}
                                radius="xl"
                              />
                            )}
                          </Table.Td>
                          <Table.Td>{phone}</Table.Td>
                          <Table.Td>{email}</Table.Td>
                          <Table.Td>
                            <ActionIcon.Group>
                              <ActionIcon
                                size="lg"
                                color="green"
                                variant="filled"
                                onClick={() => {
                                  setFormType('edit')
                                  setStudentId(studentId)
                                  setFullName(fullName)
                                  setStudyClass(studyClass)
                                  setIsMonitor(isMonitor)
                                  setEmail(email)
                                  setPhone(phone)
                                  setOpened(true)
                                }}
                              >
                                <IconEdit stroke={1.5} />
                              </ActionIcon>
                              <ActionIcon
                                size="lg"
                                color="blue"
                                variant="filled"
                                onClick={() =>
                                  showStudentQr(studentId, fullName)
                                }
                              >
                                <IconIdBadge2 stroke={1.5} />
                              </ActionIcon>
                              {roleName === 'Quản trị viên' && (
                                <ActionIcon
                                  size="lg"
                                  color="red"
                                  variant="filled"
                                  onClick={() =>
                                    deleteStudent(studentId, fullName)
                                  }
                                >
                                  <IconTrash stroke={1.5} />
                                </ActionIcon>
                              )}
                            </ActionIcon.Group>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              <Center>
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={Number(itemsPerPage)}
                  totalItems={filteredStudents.length}
                />
              </Center>
            </>
          )}
        </>
      )}
    </>
  )
}
