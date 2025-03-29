import { Button, Container, Text, Title } from '@mantine/core'
import { IconCalendarEvent } from '@tabler/icons-react'

import { Dots } from '@/components'

import classes from './home.module.css'

export const Home = () => {
  //

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Hệ thống quản lý{' '}
          <Text component="span" className={classes.highlight} inherit>
            Hoạt động sinh viên
          </Text>
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Hệ thống quản lý dành cho Ban quản trị dùng quản lý, thống kê các
            hoạt động của sinh viên, cũng như các sự kiện của trường HUTECH.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            component="a"
            className={classes.control}
            size="lg"
            href="/#/events"
            leftSection={<IconCalendarEvent stroke={1.5} />}
          >
            Tạo sự kiện
          </Button>
        </div>
      </div>
    </Container>
  )
}
