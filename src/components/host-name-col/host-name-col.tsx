import { Loader, Text } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { HOSTS_API_URL } from '@/utils'

export const HostNameCol = ({ hostId }: { hostId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hostName, setHostName] = useState('')

  useEffect(() => {
    if (hostId !== '') {
      setIsLoading(true)
      findHost(hostId)
    }
  }, [])

  const findHost = async (hostId: string) => {
    try {
      const res = await axios.get(
        `${HOSTS_API_URL}/get-name-by-id?hostId=${hostId}`
      )

      if (res.status == 200) {
        setHostName(res.data)
      }
    } catch (e: any) {
      console.error('Lỗi lấy thông tin:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader color="#fff" size="xs" mr="xs" />
      ) : hostName === '' ? (
        <Text c="red" fw={700}>
          Trống...
        </Text>
      ) : (
        hostName
      )}
    </>
  )
}
