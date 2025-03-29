import {
  ColorSwatch,
  Group,
  Loader,
  MultiSelectProps,
  Text
} from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { DASHBOARD_LABELS_API_URL } from '@/utils'

export const MultiSelectLabel: MultiSelectProps['renderOption'] = ({
  option: label
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    setIsLoading(true)
    findLabel(label.label)
  }, [])

  const findLabel = async (name: string) => {
    const docData = (
      await axios.get(`${DASHBOARD_LABELS_API_URL}/find-by-name?name=${name}`)
    ).data

    setName(docData.name)
    setColor(docData.color)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (
        <Loader color="blue" />
      ) : (
        <Group gap="sm">
          <ColorSwatch color={color} />
          <Text size="sm">{name}</Text>
        </Group>
      )}
    </>
  )
}
