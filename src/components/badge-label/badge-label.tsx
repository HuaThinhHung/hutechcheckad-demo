import { Badge, Loader } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { DASHBOARD_LABELS_API_URL } from '@/utils'

export const BadgeLabel = ({ label }: { label: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [labelName, setLabelName] = useState('')
  const [labelColor, setLabelColor] = useState('')

  useEffect(() => {
    setIsLoading(true)
    findLabel(label)
  }, [])

  const findLabel = async (labelId: string) => {
    try {
      const res = await axios.get(
        `${DASHBOARD_LABELS_API_URL}/get-by-id?labelId=${labelId}`
      )

      if (res.status == 200) {
        const docData = res.data
        setLabelName(docData.name)
        setLabelColor(docData.color)
        setIsLoading(false)
      }
    } catch (e: any) {
      if (e.response.status == 404) {
        console.error('Không tìm thấy nhãn')
      } else {
        console.error('Lỗi lấy thông tin nhãn:', e)
      }
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader color="blue" size="xs" mr="xs" />
      ) : (
        <Badge color={labelColor} mr="xs">
          {labelName}
        </Badge>
      )}
    </>
  )
}
