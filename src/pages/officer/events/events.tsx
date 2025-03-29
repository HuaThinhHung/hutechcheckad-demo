import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Modal,
  MultiSelect,
  rem,
  Select,
  SimpleGrid,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
  useMantineTheme
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { modals } from '@mantine/modals'
import {
  IconBuildingCommunity,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCheck,
  IconDoor,
  IconEdit,
  IconEye,
  IconPhoto,
  IconSearch,
  IconTag,
  IconTrash,
  IconX
} from '@tabler/icons-react'
import axios from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import icon_event from '@/assets/icon_event.jpg'
import {
  BadgeLabel,
  CheckboxAllowCheckin,
  CheckboxDisplayEvent,
  HostNameCol,
  MultiSelectLabel,
  NumberParticipants,
  NumberParticipantsCollaborator,
  Pagination,
  SelectTemplate
} from '@/components'
import {
  FILTER_BY_SEARCH_EVENTS,
  selectFilteredEvents,
  selectRoleName
} from '@/redux'
import {
  DASHBOARD_CERTS_API_URL,
  DASHBOARD_EVENTS_API_URL,
  DASHBOARD_LABELS_API_URL,
  DASHBOARD_TEMPLATES_API_URL,
  formatDate,
  formatDateTime,
  HOSTS_API_URL
} from '@/utils'

import classes from './events.module.css'

export const Events = () => {
  const theme = useMantineTheme()

  // It is required to extend dayjs with customParseFormat plugin
  // in order to parse dates with custom format
  dayjs.extend(customParseFormat)

  const [opened, setOpened] = useState(false)
  const [formIsLoading, setFormIsLoading] = useState(false)
  const [eventsData, setEventsData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const filteredEvents = useSelector(selectFilteredEvents)
  const [hostsData, setHostsData] = useState([])
  const [labelsData, setLabelsData] = useState([])
  const [templatesData, setTemplatesData] = useState([])

  const [search, setSearch] = useState('')
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | null>('10')
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage)
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem)

  const roleName = useSelector(selectRoleName)

  const [formType, setFormType] = useState<'add' | 'edit'>('add')
  const [docId, setDocId] = useState('')
  const [title, setTitle] = useState('')
  const [tempTitle, setTempTitle] = useState('')
  const [host, setHost] = useState<string | null>('')
  const [labels, setLabels] = useState<string[]>([])
  const [eventDate, setEventDate] = useState<Date | null>(null)
  const [room, setRoom] = useState('')
  const [template, setTemplate] = useState<string | null>('')
  const [allowExport, setAllowExport] = useState(true)
  const [allowCheckin, setAllowCheckin] = useState(true)
  const [display, setDisplay] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    getAllEvents()
    getAllHosts()
    getAllLabels()
    getAllTemplates()
  }, [])

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH_EVENTS({ events: eventsData, search }))
    setCurrentPage(1)
  }, [dispatch, eventsData, search])

  const getAllEvents = async () => {
    try {
      const res = await axios.get(`${DASHBOARD_EVENTS_API_URL}/get-all`)
      if (res.status == 200) {
        setEventsData(res.data)
      }
    } catch (e: any) {
      setEventsData([])
      console.log('Lỗi lấy dữ liệu sự kiện: ' + e)
    } finally {
      setIsLoading(false)
    }
  }

  const getAllHosts = async () => {
    try {
      const res = await axios.get(`${HOSTS_API_URL}/get-all`)
      if (res.status == 200) {
        setHostsData(res.data)
      }
    } catch (e: any) {
      console.log('Lỗi lấy dữ liệu đơn vị tổ chức: ' + e)
    }
  }

  const getAllLabels = async () => {
    try {
      const res = await axios.get(`${DASHBOARD_LABELS_API_URL}/get-all`)
      if (res.status == 200) {
        setLabelsData(res.data)
      }
    } catch (e: any) {
      console.log('Lỗi lấy dữ liệu nhãn chủ đề: ' + e)
    }
  }

  const getAllTemplates = async () => {
    try {
      const res = await axios.get(`${DASHBOARD_TEMPLATES_API_URL}/get-all`)
      if (res.status == 200) {
        setTemplatesData(res.data)
      }
    } catch (e: any) {
      console.log('Lỗi lấy dữ liệu chứng nhận: ' + e)
    }
  }

  const handleAddEvent = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_EVENTS_API_URL}/add`, {
        title: title,
        host: host,
        labels: labels,
        date: eventDate,
        room: room,
        template: template,
        allowExport: allowExport,
        allowCheckin: allowCheckin,
        display: display
      })

      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Thêm sự kiện',
          `Đã thêm sự kiện "${title}" thành công!`,
          false
        )
        resetForm()
        await getAllEvents()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error('Lỗi', 'Sự kiện này đã tồn tại.', false)
      } else {
        console.log('Lỗi thêm sự kiện:', e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleEditEvent = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_EVENTS_API_URL}/update`, {
        docId: docId,
        title: title,
        tempTitle: tempTitle,
        host: host,
        labels: labels,
        date: eventDate,
        room: room,
        template: template,
        allowExport: allowExport,
        allowCheckin: allowCheckin,
        display: display
      })

      if (res.status == 200) {
        setOpened(false)
        window.SweetAlert.success(
          'Sửa sự kiện',
          `Đã cập nhật sự kiện "${title}" thành công!`,
          false
        )
        resetForm()
        await getAllEvents()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error('Lỗi', `Đã tồn tại sự kiện "${title}"`, false)
      } else {
        console.log('Lỗi sửa sự kiện:', e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const findAndDeleteCerts = async (evId: string) => {
    const docsSnap = (
      await axios.get(
        `${DASHBOARD_CERTS_API_URL}/find-by-event-id?evId=${evId}`
      )
    ).data

    const docsLength = docsSnap.length
    let certDeleted = 0

    if (docsLength > 0) {
      const removeListener = docsSnap.map(async (cert: any) => {
        const res = await axios.post(`${DASHBOARD_CERTS_API_URL}/delete`, {
          docId: cert.id
        })
        if (res.status == 200) {
          certDeleted += 1
        }
      })

      await Promise.all(removeListener)
    }

    return { certDeleted, docsLength }
  }

  const deleteEvent = async (eventId: string, title: string) => {
    modals.openConfirmModal({
      title: 'Xóa sự kiện',
      centered: true,
      closeOnClickOutside: false,
      children: (
        <Text>
          Bạn có chắc muốn xóa sự kiện <b>"{title}"</b> không? Đồng thời các
          sinh viên tham dự sẽ không còn chứng nhận của sự kiện này nữa.
        </Text>
      ),
      labels: { confirm: 'Xóa sự kiện', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        window.SweetAlert.info(
          'Xóa sự kiện',
          `Đang tiến hành việc xóa sự kiện "${title}" và các thông tin liên quan......`,
          true
        )
        const { certDeleted, docsLength } = await findAndDeleteCerts(eventId)
        await axios.post(`${DASHBOARD_EVENTS_API_URL}/delete`, { eventId })
        window.SweetAlert.success(
          'Xóa sự kiện',
          `Đã xóa sự kiện "${title}", và ${certDeleted}/${docsLength} chứng nhận liên quan thành công!`,
          false
        )
        await getAllEvents()
      }
    })
  }

  const resetForm = () => {
    setDocId('')
    setTitle('')
    setHost('')
    setLabels([])
    setEventDate(null)
    setRoom('')
    setTemplate('')
    setAllowExport(true)
    setAllowCheckin(true)
    setDisplay(true)
  }

  return (
    <>
      <Title order={2}>Danh sách sự kiện</Title>
      <Text>
        Bạn có thể tạo mới sự kiện để điểm danh hoặc xem danh sách sinh viên
        tham gia sự kiện tại đây.
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
            title={formType == 'add' ? 'Thêm sự kiện mới' : 'Sửa sự kiện'}
            centered
            removeScrollProps={{ allowPinchZoom: true }}
            closeOnClickOutside={false}
          >
            <form
              onSubmit={formType == 'add' ? handleAddEvent : handleEditEvent}
            >
              <TextInput
                mt="md"
                label="Tiêu đề"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                radius="md"
                disabled={formIsLoading}
              />
              <MultiSelect
                mt="md"
                label="Chủ đề"
                data={
                  labelsData.map((label: any) => {
                    return { value: label.id, label: label.name }
                  }) || []
                }
                renderOption={MultiSelectLabel}
                value={labels}
                onChange={setLabels}
                clearable
                searchable
                nothingFoundMessage="Không tìm thấy chủ đề này..."
                hidePickedOptions
                comboboxProps={{
                  transitionProps: { transition: 'scale-y', duration: 200 }
                }}
                radius="md"
                leftSection={<IconTag size={18} stroke={1.5} />}
                disabled={formIsLoading}
              />
              <Group grow mt="md">
                <DateTimePicker
                  label="Thời gian diễn ra"
                  placeholder="Chọn ngày, giờ..."
                  value={eventDate}
                  onChange={setEventDate}
                  valueFormat="DD/MM/YYYY HH:mm"
                  required
                  radius="md"
                  leftSection={<IconCalendarEvent size={18} stroke={1.5} />}
                  leftSectionPointerEvents="none"
                  disabled={formIsLoading}
                />
                <TextInput
                  label="Nơi diễn ra"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  radius="md"
                  leftSection={<IconDoor size={18} stroke={1.5} />}
                  disabled={formIsLoading}
                />
              </Group>
              <Group grow mt="md">
                <Select
                  label="Đơn vị tổ chức"
                  data={hostsData.map((host: any) => {
                    return { value: host.hostId, label: host.name }
                  })}
                  value={host}
                  onChange={setHost}
                  required
                  limit={5}
                  searchable
                  nothingFoundMessage="Không tìm thấy đơn vị này..."
                  comboboxProps={{
                    transitionProps: { transition: 'scale-y', duration: 200 }
                  }}
                  radius="md"
                  leftSection={<IconBuildingCommunity size={18} stroke={1.5} />}
                  disabled={formIsLoading}
                />
                <Select
                  label="Mẫu xuất giấy chứng nhận"
                  data={
                    templatesData.map((template: any) => {
                      return { value: template.id, label: template.title }
                    }) || []
                  }
                  renderOption={SelectTemplate}
                  value={template}
                  onChange={setTemplate}
                  required
                  clearable
                  limit={5}
                  searchable
                  nothingFoundMessage="Không tìm thấy mẫu này..."
                  comboboxProps={{
                    transitionProps: { transition: 'scale-y', duration: 200 }
                  }}
                  radius="md"
                  leftSection={<IconPhoto size={18} stroke={1.5} />}
                  disabled={formIsLoading}
                />
              </Group>
              <Switch
                mt="md"
                checked={allowExport}
                onChange={event => setAllowExport(event.currentTarget.checked)}
                color="teal"
                label="Cho phép xuất giấy chứng nhận"
                disabled
                onLabel="Bật"
                offLabel="Tắt"
                thumbIcon={
                  allowExport ? (
                    <IconCheck
                      style={{ width: rem(12), height: rem(12) }}
                      color={theme.colors.teal[6]}
                      stroke={3}
                    />
                  ) : (
                    <IconX
                      style={{ width: rem(12), height: rem(12) }}
                      color={theme.colors.red[6]}
                      stroke={3}
                    />
                  )
                }
              />
              <Switch
                mt="md"
                checked={allowCheckin}
                onChange={event => setAllowCheckin(event.currentTarget.checked)}
                color="teal"
                label="Cho phép check-in sự kiện này"
                onLabel="Bật"
                offLabel="Tắt"
                thumbIcon={
                  allowCheckin ? (
                    <IconCheck
                      style={{ width: rem(12), height: rem(12) }}
                      color={theme.colors.teal[6]}
                      stroke={3}
                    />
                  ) : (
                    <IconX
                      style={{ width: rem(12), height: rem(12) }}
                      color={theme.colors.red[6]}
                      stroke={3}
                    />
                  )
                }
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
            leftSection={<IconCalendarPlus size={24} />}
          >
            Thêm sự kiện
          </Button>

          <Group justify="space-between">
            <div>
              <TextInput
                label={
                  <>
                    <b>{filteredEvents.length}</b> sự kiện
                  </>
                }
                placeholder="Tìm kiếm sự kiện"
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

          {filteredEvents.length === 0 ? (
            <Text>Không có dữ liệu nào.</Text>
          ) : (
            <>
              {roleName === 'Quản trị viên' ? (
                <>
                  <Table.ScrollContainer my="md" minWidth={500} type="native">
                    <Table striped highlightOnHover withTableBorder>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Thời gian</Table.Th>
                          <Table.Th>Tên sự kiện</Table.Th>
                          <Table.Th>Nơi diễn ra</Table.Th>
                          <Table.Th>Đơn vị</Table.Th>
                          <Table.Th>Checkin</Table.Th>
                          <Table.Th>Hiển thị</Table.Th>
                          <Table.Th>Số lượng tham gia</Table.Th>
                          <Table.Th>Hành động</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {currentItems.map((event: any, index: any) => {
                          const {
                            id,
                            title,
                            host,
                            labels,
                            date,
                            room,
                            template,
                            allowExport,
                            allowCheckin,
                            display
                          } = event

                          return (
                            <Table.Tr key={id}>
                              <Table.Td>{formatDateTime(date)}</Table.Td>
                              <Table.Td miw={150} maw={275}>
                                {title}
                                <br />
                                {labels.map((label: any, index: any) => (
                                  <BadgeLabel key={index} label={label} />
                                ))}
                              </Table.Td>
                              <Table.Td>{room}</Table.Td>
                              <Table.Td>
                                <HostNameCol hostId={host} />
                              </Table.Td>
                              <Table.Td>
                                <CheckboxAllowCheckin
                                  docId={id}
                                  allowCheckin={allowCheckin}
                                />
                              </Table.Td>
                              <Table.Td>
                                <CheckboxDisplayEvent
                                  docId={id}
                                  display={display}
                                />
                              </Table.Td>
                              <Table.Td>
                                <NumberParticipants docId={id} />
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
                                      setTitle(title)
                                      setTempTitle(title)
                                      setHost(host)
                                      setLabels(labels)
                                      setEventDate(new Date(date))
                                      setRoom(room)
                                      setTemplate(template)
                                      setAllowExport(allowExport)
                                      setAllowCheckin(allowCheckin)
                                      setDisplay(display)
                                      setOpened(true)
                                    }}
                                  >
                                    <IconEdit stroke={1.5} />
                                  </ActionIcon>
                                  <ActionIcon<'a'>
                                    size="lg"
                                    component="a"
                                    color="blue"
                                    variant="filled"
                                    href={`/#/events/${id}`}
                                  >
                                    <IconEye stroke={1.5} />
                                  </ActionIcon>
                                  <ActionIcon
                                    size="lg"
                                    color="red"
                                    variant="filled"
                                    onClick={() => {
                                      deleteEvent(id, title)
                                    }}
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
                </>
              ) : (
                <>
                  <SimpleGrid
                    my="md"
                    cols={{ base: 1, sm: 2, lg: 3 }}
                    spacing="xs"
                    verticalSpacing="xs"
                  >
                    {currentItems.map((event: any, index: any) => {
                      const { id, title, date, room } = event

                      return (
                        <Card
                          p="lg"
                          shadow="lg"
                          className={classes.card}
                          radius="md"
                          component="a"
                          href={`/#/events/${id}`}
                          key={id + index}
                        >
                          <div
                            className={classes.image}
                            style={{
                              backgroundImage: `url(${icon_event})`
                            }}
                          />
                          <div className={classes.overlay} />

                          <div className={classes.content}>
                            <div>
                              <Text
                                size="lg"
                                className={classes.title}
                                fw={500}
                              >
                                {title}
                              </Text>

                              <Group justify="space-between" gap="xs">
                                <Text size="sm" className={classes.author}>
                                  {formatDate(date)}
                                  {room && <> - {room}</>}
                                </Text>

                                <NumberParticipantsCollaborator docId={id} />
                              </Group>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </SimpleGrid>
                </>
              )}

              <Center mt="md">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={Number(itemsPerPage)}
                  totalItems={filteredEvents.length}
                />
              </Center>
            </>
          )}
        </>
      )}
    </>
  )
}
