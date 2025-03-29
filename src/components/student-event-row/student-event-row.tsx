import { Button, Loader, Table } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

import {
  ACCOUNTS_API_URL,
  convertTimestampToDate,
  DASHBOARD_CERTS_API_URL,
  DASHBOARD_STUDENTS_API_URL
} from '@/utils'

export const StudentEventRow = ({
  student,
  isCheckedOut,
  handleRefresh
}: {
  student: any
  isCheckedOut: boolean
  handleRefresh: () => Promise<void>
}) => {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState<any>(null)
  const [studyClass, setStudyClass] = useState<any>(null)
  const [phone, setPhone] = useState<any>(null)
  const [email, setEmail] = useState<any>(null)
  const [checkinBy, setCheckinBy] = useState<any>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [waitRemove, setWaitRemove] = useState(false)

  useEffect(() => {
    setLoading(true)
    getStudent()
  }, [])

  const getStudent = async () => {
    try {
      const res = await axios.get(
        `${DASHBOARD_STUDENTS_API_URL}/get-by-id?studentId=${student.studentId}`
      )

      if (res.status == 200) {
        const stData = res.data
        setFullName(stData.fullName)
        setStudyClass(stData.studyClass)
        setPhone(stData.phone)
        setEmail(stData.email)

        if (student.checkinBy !== '') {
          const checkedInBy = (
            await axios.get(
              `${ACCOUNTS_API_URL}/get-name-by-id?uid=${student.checkinBy}`
            )
          ).data.value
          setCheckinBy(checkedInBy)
        } else {
          setCheckinBy('')
        }
      }
    } catch (e: any) {
      console.error(e.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckinAgain = async (studentId: string) => {
    setBtnLoading(true)
    await axios.post(`${DASHBOARD_CERTS_API_URL}/checkin-again`, {
      evId: student.eventId,
      studentId: studentId
    })
    window.SweetAlert.success(
      'Check-in sinh viên',
      `Đã check-in sinh viên ${studentId} tham dự lại.`,
      false
    )
    setBtnLoading(false)
    await handleRefresh()
  }

  const handleCheckout = async (studentId: string) => {
    setBtnLoading(true)
    await axios.post(`${DASHBOARD_CERTS_API_URL}/checkout`, {
      evId: student.eventId,
      studentId: studentId
    })
    window.SweetAlert.success(
      'Hủy check-out sinh viên',
      `Đã check-out sinh viên ${studentId} thành công.`,
      false
    )
    setBtnLoading(false)
    await handleRefresh()
  }

  const handleCancelCheckin = async (studentId: string) => {
    setWaitRemove(true)
    await axios.post(`${DASHBOARD_CERTS_API_URL}/delete`, {
      docId: `${student.eventId}_${studentId}`
    })
    window.SweetAlert.success(
      'Hủy check-in sinh viên',
      `Đã hủy check-in sinh viên ${studentId} thành công.`,
      false
    )
    setWaitRemove(false)
    await handleRefresh()
  }

  return loading ? (
    <Loader color="blue" type="dots" />
  ) : (
    <Table.Tr>
      <Table.Td>{student.studentId}</Table.Td>
      <Table.Td>{fullName}</Table.Td>
      <Table.Td>{studyClass}</Table.Td>
      <Table.Td>{email}</Table.Td>
      <Table.Td>{phone}</Table.Td>
      <Table.Td>{convertTimestampToDate(student.checkinAt)}</Table.Td>
      <Table.Td>
        {student.checkoutAt && convertTimestampToDate(student.checkoutAt)}
      </Table.Td>
      <Table.Td>{checkinBy}</Table.Td>
      <Table.Td>
        <Button.Group>
          {!isCheckedOut ? (
            <Button
              variant="filled"
              loading={btnLoading}
              color="green"
              onClick={() => handleCheckout(student.studentId)}
            >
              Checkout
            </Button>
          ) : (
            <Button
              variant="filled"
              loading={btnLoading}
              color="green"
              onClick={() => handleCheckinAgain(student.studentId)}
            >
              Hủy Checkout
            </Button>
          )}
          <Button
            variant="filled"
            color="red"
            loading={waitRemove}
            onClick={() => handleCancelCheckin(student.studentId)}
          >
            Hủy Checkin
          </Button>
        </Button.Group>
      </Table.Td>
    </Table.Tr>
  )
}
