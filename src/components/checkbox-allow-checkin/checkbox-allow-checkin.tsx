import { Loader, rem, Switch, useMantineTheme } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import axios from 'axios'
import { useState } from 'react'

import { DASHBOARD_EVENTS_API_URL } from '@/utils'

export const CheckboxAllowCheckin = ({
  docId,
  allowCheckin
}: {
  docId: string
  allowCheckin: boolean
}) => {
  const theme = useMantineTheme()

  const [waitingUpdate, setWaitingUpdate] = useState(false)

  const handleUpdate = async (docId: string, value: any) => {
    setWaitingUpdate(true)

    await axios
      .post(`${DASHBOARD_EVENTS_API_URL}/update-allow-checkin`, {
        docId: docId,
        allowCheckin: value
      })
      .then(() => {
        setWaitingUpdate(false)
      })
      .catch((e: any) => {
        setWaitingUpdate(false)
        window.SweetAlert.error(
          'Lỗi',
          `Không thể cập nhật trạng thái checkin: ${e}`,
          false
        )
      })
  }

  return (
    <>
      {waitingUpdate ? (
        <Loader color="blue" size="sm" />
      ) : (
        <Switch
          mt="md"
          checked={allowCheckin}
          onChange={event => handleUpdate(docId, event.currentTarget.checked)}
          color="teal"
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
        />
      )}
    </>
  )
}
