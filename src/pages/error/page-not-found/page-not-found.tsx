import { Button, Container, Group, Text, Title } from '@mantine/core'

import { Illustration } from './illustration'
import classes from './page-not-found.module.css'

export const PageNotFound = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>
            Bạn đã tìm thấy một nơi bí mật.
          </Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            Thật không may, đây chỉ là trang 404. Có thể bạn đã nhập sai địa chỉ
            hoặc trang đã được chuyển sang một URL khác.
          </Text>
          <Group justify="center">
            <Button variant="subtle" size="md" component="a" href="#/">
              Đưa tôi về trang chủ
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  )
}
