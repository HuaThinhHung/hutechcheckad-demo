import { Skeleton, Table } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { DASHBOARD_STUDENTS_API_URL } from '@/utils'

export const StudentEventPRRow = ({ studentId }: { studentId: string }) => {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState<any>(null)
  const [studyClass, setStudyClass] = useState<any>(null)
  const [phone, setPhone] = useState<any>(null)
  const [email, setEmail] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    getStudent()
  }, [])

  const getStudent = async () => {
    try {
      const res = await axios.get(
        `${DASHBOARD_STUDENTS_API_URL}/get-by-id?studentId=${studentId}`
      )

      if (res.status == 200) {
        const stData = res.data
        setFullName(stData.fullName)
        setStudyClass(stData.studyClass)
        setPhone(stData.phone)
        setEmail(stData.email)
      }
    } catch (e: any) {
      console.error(e.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return loading ? (
    <Table.Tr>
      <Table.Td>
        <Skeleton height={16} width="50%" radius="xl" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} radius="xl" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} width="50%" radius="xl" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} radius="xl" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} width="50%" radius="xl" />
      </Table.Td>
    </Table.Tr>
  ) : (
    <Table.Tr>
      <Table.Td>{studentId}</Table.Td>
      <Table.Td>{fullName}</Table.Td>
      <Table.Td>{studyClass}</Table.Td>
      <Table.Td>{email}</Table.Td>
      <Table.Td>{phone}</Table.Td>
    </Table.Tr>
  )
}
