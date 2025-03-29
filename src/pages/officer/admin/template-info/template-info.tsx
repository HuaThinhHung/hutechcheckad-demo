import {
  Button,
  Card,
  Center,
  Checkbox,
  ColorInput,
  Grid,
  Group,
  Loader,
  rem,
  Slider,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  compressImageSize,
  DASHBOARD_TEMPLATES_API_URL,
  getMegabyte,
  textGetLines
} from '@/utils'

export const TemplateInfo = () => {
  const { id } = useParams()

  function detectForm(id: any, f1: any, f2: any) {
    if (id === 'NEW') {
      return f1
    }
    return f2
  }

  const [formIsLoading, setFormIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(false)
  const [templateTitle, setTemplateTitle] = useState('')
  const [tempTemplateTitle, setTempTemplateTitle] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [templateImg, setTemplateImg] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCanvasLoading, setIsCanvasLoading] = useState(true)
  const cefWidth = 3371
  const cefHeight = 2420
  // Tiêu đề sự kiện
  const [isDisplayEventTitle, setIsDisplayEventTitle] = useState<boolean>(true)
  const [eventTitleX, setEventTitleX] = useState<number>(1685) // min 0, max 3371
  const [eventTitleY, setEventTitleY] = useState<number>(1480) // min 0, max 2420
  const [eventTitleFs, setEventTitleFs] = useState<number>(60) // min 0, max 130
  const [eventTitleColor, setEventTitleColor] = useState<string>('#000000')
  // Đơn vị tổ chức
  const [isDisplayCefHost, setIsDisplayCefHost] = useState<boolean>(true)
  const [cefHostX, setCefHostX] = useState<number>(1685) // min 0, max 3371
  const [cefHostY, setCefHostY] = useState<number>(1108) // min 0, max 2420
  const [cefHostFs, setCefHostFs] = useState<number>(55) // min 0, max 130
  const [cefHostColor, setCefHostColor] = useState<string>('#000000')
  // Tên sinh viên
  const [isDisplayStudentName, setIsDisplayStudentName] =
    useState<boolean>(true)
  const [studentNameX, setStudentNameX] = useState<number>(1685) // min 0, max 3371
  const [studentNameY, setStudentNameY] = useState<number>(960) // min 0, max 2420
  const [studentNameFs, setStudentNameFs] = useState<number>(60) // min 0, max 130
  const [studentNameColor, setStudentNameColor] = useState<string>('#0062cc')
  // Mã số sinh viên
  const [isDisplayStudentCode, setIsDisplayStudentCode] =
    useState<boolean>(true)
  const [studentCodeX, setStudentCodeX] = useState<number>(1685) // min 0, max 3371
  const [studentCodeY, setStudentCodeY] = useState<number>(1108) // min 0, max 2420
  const [studentCodeFs, setStudentCodeFs] = useState<number>(55) // min 0, max 130
  const [studentCodeColor, setStudentCodeColor] = useState<string>('#000000')
  // Số chứng nhận
  const [isDisplayCefNo, setIsDisplayCefNo] = useState<boolean>(true)
  const [cefNoX, setCefNoX] = useState<number>(200) // min 0, max 3371
  const [cefNoY, setCefNoY] = useState<number>(2220) // min 0, max 2420
  const [cefNoFs, setCefNoFs] = useState<number>(32) // min 0, max 130
  const [cefNoColor, setCefNoColor] = useState<string>('#000000')
  // Ngày chứng nhận
  const [isDisplayCefDay, setIsDisplayCefDay] = useState<boolean>(true)
  const [cefDayX, setCefDayX] = useState<number>(2598) // min 0, max 3371
  const [cefDayY, setCefDayY] = useState<number>(1683) // min 0, max 2420
  const [cefDayFs, setCefDayFs] = useState<number>(35) // min 0, max 130
  const [cefDayColor, setCefDayColor] = useState<string>('#000000')
  // Tháng chứng nhận
  const [isDisplayCefMonth, setIsDisplayCefMonth] = useState<boolean>(true)
  const [cefMonthX, setCefMonthX] = useState<number>(2785) // min 0, max 3371
  const [cefMonthY, setCefMonthY] = useState<number>(1683) // min 0, max 2420
  const [cefMonthFs, setCefMonthFs] = useState<number>(35) // min 0, max 130
  const [cefMonthColor, setCefMonthColor] = useState<string>('#000000')
  // Năm chứng nhận
  const [isDisplayCefYear, setIsDisplayCefYear] = useState<boolean>(true)
  const [cefYearX, setCefYearX] = useState<number>(3015) // min 0, max 3371
  const [cefYearY, setCefYearY] = useState<number>(1683) // min 0, max 2420
  const [cefYearFs, setCefYearFs] = useState<number>(35) // min 0, max 130
  const [cefYearColor, setCefYearColor] = useState<string>('#000000')

  // Dữ liệu mẫu cho test
  const text_eventtitle = 'HỘI THẢO ĐỊNH HƯỚNG NGHỀ NGHIỆP'
  const text_studentname = 'Nguyễn Khánh Duy'
  const text_studentcode = '2180602080'
  const text_cefno = 'Số:     5555/CN2021CNTT'
  const text_cefday = '15'
  const text_cefmonth = '06'
  const text_cefyear = '24'
  const text_cefhost = 'Khoa Công Nghệ Thông Tin'

  useEffect(() => {
    if (id != null && id != 'NEW') {
      setIsGettingData(true)
      getTemplateDataFromId(id)
    }
  }, [id])

  useEffect(() => {
    if (templateImg != '') {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const image = new Image()
      image.src = templateImg

      image.onload = () => {
        setIsCanvasLoading(false)

        // Đặt kích thước canvas
        canvas.width = 3371
        canvas.height = 2420

        // Vẽ hình ảnh lên canvas với kích thước cố định
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, cefWidth, cefHeight)

        // Đặt thông tin
        ctx.textAlign = 'center'

        // Tên sinh viên
        ctx.font = `bold ${studentNameFs}pt Arial`
        ctx.fillStyle = studentNameColor
        if (isDisplayStudentName) {
          ctx.fillText(text_studentname, studentNameX, studentNameY)
        }

        // Mã số sinh viên
        ctx.font = `${studentCodeFs}pt Arial`
        ctx.fillStyle = studentCodeColor
        if (isDisplayStudentCode) {
          ctx.fillText('MSSV: ' + text_studentcode, studentCodeX, studentCodeY)
        }

        // Đơn vị tổ chứ
        ctx.font = `${cefHostFs}pt Arial`
        ctx.fillStyle = cefHostColor
        if (isDisplayCefHost) {
          ctx.fillText(text_cefhost, cefHostX, cefHostY)
        }

        // Event name
        ctx.font = `${eventTitleFs}pt Arial`
        ctx.fillStyle = eventTitleColor
        let maxW = 2930
        let lines = textGetLines(ctx, text_eventtitle.toUpperCase(), maxW)
        let lineY = 65
        let startY = eventTitleY - (lines.length - 1) * lineY

        if (isDisplayEventTitle) {
          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], eventTitleX, startY + i * lineY * 2)
          }
        }

        // Set info day, month, year and cef number
        ctx.font = `italic ${cefDayFs}pt Arial`
        ctx.fillStyle = cefDayColor
        if (isDisplayCefDay) ctx.fillText(text_cefday, cefDayX, cefDayY)
        if (isDisplayCefMonth) ctx.fillText(text_cefmonth, cefMonthX, cefMonthY)
        if (isDisplayCefYear) ctx.fillText(text_cefyear, cefYearX, cefYearY)

        ctx.font = `${cefNoFs}pt Arial`
        ctx.fillStyle = cefNoColor
        ctx.textAlign = 'left'
        if (isDisplayCefNo) ctx.fillText(text_cefno, cefNoX, cefNoY)
      }
    }
  }, [
    templateImg,
    isDisplayStudentName,
    studentNameX,
    studentNameY,
    studentNameFs,
    studentNameColor,
    text_studentname,
    isDisplayStudentCode,
    studentCodeX,
    studentCodeY,
    studentCodeFs,
    studentCodeColor,
    text_studentcode,
    isDisplayCefHost,
    cefHostX,
    cefHostY,
    cefHostFs,
    cefHostColor,
    text_cefhost,
    isDisplayEventTitle,
    eventTitleX,
    eventTitleY,
    eventTitleFs,
    eventTitleColor,
    text_eventtitle,
    isDisplayCefNo,
    cefNoX,
    cefNoY,
    cefNoFs,
    cefNoColor,
    text_cefno,
    isDisplayCefDay,
    cefDayX,
    cefDayY,
    cefDayFs,
    cefDayColor,
    text_cefday,
    isDisplayCefMonth,
    cefMonthX,
    cefMonthY,
    cefMonthFs,
    cefMonthColor,
    text_cefmonth,
    isDisplayCefYear,
    cefYearX,
    cefYearY,
    cefYearFs,
    cefYearColor,
    text_cefyear
  ])

  const navigate = useNavigate()

  const redirectToTemplates = () => {
    navigate('/templates')
  }

  const getTemplateDataFromId = async (id: string) => {
    try {
      const res = await axios.get(
        `${DASHBOARD_TEMPLATES_API_URL}/get?templateId=${id}`
      )

      if (res.status == 200) {
        const templateData = res.data
        setTemplateTitle(templateData.title)
        setTempTemplateTitle(templateData.title)
        setTemplateImg(templateData.image)
        setIsDisplayEventTitle(templateData.isDisplayEventTitle)
        setEventTitleX(templateData.eventTitleX)
        setEventTitleY(templateData.eventTitleY)
        setEventTitleFs(templateData.eventTitleFs)
        setEventTitleColor(templateData.eventTitleColor)
        setIsDisplayCefHost(templateData.isDisplayCefHost)
        setCefHostX(templateData.cefHostX)
        setCefHostY(templateData.cefHostY)
        setCefHostFs(templateData.cefHostFs)
        setCefHostColor(templateData.cefHostColor)
        setIsDisplayStudentName(templateData.isDisplayStudentName)
        setStudentNameX(templateData.studentNameX)
        setStudentNameY(templateData.studentNameY)
        setStudentNameFs(templateData.studentNameFs)
        setStudentNameColor(templateData.studentNameColor)
        setIsDisplayStudentCode(templateData.isDisplayStudentCode)
        setStudentCodeX(templateData.studentCodeX)
        setStudentCodeY(templateData.studentCodeY)
        setStudentCodeFs(templateData.studentCodeFs)
        setStudentCodeColor(templateData.studentCodeColor)
        setIsDisplayCefNo(templateData.isDisplayCefNo)
        setCefNoX(templateData.cefNoX)
        setCefNoY(templateData.cefNoY)
        setCefNoFs(templateData.cefNoFs)
        setCefNoColor(templateData.cefNoColor)
        setIsDisplayCefDay(templateData.isDisplayCefDay)
        setCefDayX(templateData.cefDayX)
        setCefDayY(templateData.cefDayY)
        setCefDayFs(templateData.cefDayFs)
        setCefDayColor(templateData.cefDayColor)
        setIsDisplayCefMonth(templateData.isDisplayCefMonth)
        setCefMonthX(templateData.cefMonthX)
        setCefMonthY(templateData.cefMonthY)
        setCefMonthFs(templateData.cefMonthFs)
        setCefMonthColor(templateData.cefMonthColor)
        setIsDisplayCefYear(templateData.isDisplayCefYear)
        setCefYearX(templateData.cefYearX)
        setCefYearY(templateData.cefYearY)
        setCefYearFs(templateData.cefYearFs)
        setCefYearColor(templateData.cefYearColor)

        setIsGettingData(false)
      }
    } catch (e: any) {
      if (e.response.status == 404) {
        window.SweetAlert.info(
          'Lỗi dữ liệu',
          'Không tìm thấy thông tin mẫu chứng nhận này!',
          false
        )
      } else {
        console.log('Lỗi lấy dữ liệu:', e)
      }
      redirectToTemplates()
    }
  }

  const addTemplate = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_TEMPLATES_API_URL}/add`, {
        title: templateTitle,
        image: templateImg,
        // Tiêu đề sự kiện
        isDisplayEventTitle: isDisplayEventTitle,
        eventTitleX: eventTitleX,
        eventTitleY: eventTitleY,
        eventTitleFs: eventTitleFs,
        eventTitleColor: eventTitleColor,
        // Đơn vị tổ chức
        isDisplayCefHost: isDisplayCefHost,
        cefHostX: cefHostX,
        cefHostY: cefHostY,
        cefHostFs: cefHostFs,
        cefHostColor: cefHostColor,
        // Tên sinh viên
        isDisplayStudentName: isDisplayStudentName,
        studentNameX: studentNameX,
        studentNameY: studentNameY,
        studentNameFs: studentNameFs,
        studentNameColor: studentNameColor,
        // Mã số sinh viên
        isDisplayStudentCode: isDisplayStudentCode,
        studentCodeX: studentCodeX,
        studentCodeY: studentCodeY,
        studentCodeFs: studentCodeFs,
        studentCodeColor: studentCodeColor,
        // Số chứng nhận
        isDisplayCefNo: isDisplayCefNo,
        cefNoX: cefNoX,
        cefNoY: cefNoY,
        cefNoFs: cefNoFs,
        cefNoColor: cefNoColor,
        // Ngày chứng nhận
        isDisplayCefDay: isDisplayCefDay,
        cefDayX: cefDayX,
        cefDayY: cefDayY,
        cefDayFs: cefDayFs,
        cefDayColor: cefDayColor,
        // Tháng chứng nhận
        isDisplayCefMonth: isDisplayCefMonth,
        cefMonthX: cefMonthX,
        cefMonthY: cefMonthY,
        cefMonthFs: cefMonthFs,
        cefMonthColor: cefMonthColor,
        // Năm chứng nhận
        isDisplayCefYear: isDisplayCefYear,
        cefYearX: cefYearX,
        cefYearY: cefYearY,
        cefYearFs: cefYearFs,
        cefYearColor: cefYearColor
      })

      if (res.status == 200) {
        window.SweetAlert.success(
          'Thêm mẫu CN',
          `Đã thêm mẫu chứng nhận "${templateTitle}" thành công!`,
          false
        )
        redirectToTemplates()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error(
          'Lỗi',
          `Đã tồn tại mẫu chứng nhận "${templateTitle}"`,
          false
        )
      } else {
        console.log('Lỗi lấy dữ liệu:', e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const editTemplate = async (e: any) => {
    e.preventDefault()

    setFormIsLoading(true)

    try {
      const res = await axios.post(`${DASHBOARD_TEMPLATES_API_URL}/update`, {
        docId: id!,
        title: templateTitle,
        tempTitle: tempTemplateTitle,
        image: templateImg,
        // Tiêu đề sự kiện
        isDisplayEventTitle: isDisplayEventTitle,
        eventTitleX: eventTitleX,
        eventTitleY: eventTitleY,
        eventTitleFs: eventTitleFs,
        eventTitleColor: eventTitleColor,
        // Đơn vị tổ chức
        isDisplayCefHost: isDisplayCefHost,
        cefHostX: cefHostX,
        cefHostY: cefHostY,
        cefHostFs: cefHostFs,
        cefHostColor: cefHostColor,
        // Tên sinh viên
        isDisplayStudentName: isDisplayStudentName,
        studentNameX: studentNameX,
        studentNameY: studentNameY,
        studentNameFs: studentNameFs,
        studentNameColor: studentNameColor,
        // Mã số sinh viên
        isDisplayStudentCode: isDisplayStudentCode,
        studentCodeX: studentCodeX,
        studentCodeY: studentCodeY,
        studentCodeFs: studentCodeFs,
        studentCodeColor: studentCodeColor,
        // Số chứng nhận
        isDisplayCefNo: isDisplayCefNo,
        cefNoX: cefNoX,
        cefNoY: cefNoY,
        cefNoFs: cefNoFs,
        cefNoColor: cefNoColor,
        // Ngày chứng nhận
        isDisplayCefDay: isDisplayCefDay,
        cefDayX: cefDayX,
        cefDayY: cefDayY,
        cefDayFs: cefDayFs,
        cefDayColor: cefDayColor,
        // Tháng chứng nhận
        isDisplayCefMonth: isDisplayCefMonth,
        cefMonthX: cefMonthX,
        cefMonthY: cefMonthY,
        cefMonthFs: cefMonthFs,
        cefMonthColor: cefMonthColor,
        // Năm chứng nhận
        isDisplayCefYear: isDisplayCefYear,
        cefYearX: cefYearX,
        cefYearY: cefYearY,
        cefYearFs: cefYearFs,
        cefYearColor: cefYearColor
      })

      if (res.status == 200) {
        window.SweetAlert.success(
          'Thêm mẫu CN',
          `Đã thêm mẫu chứng nhận "${templateTitle}" thành công!`,
          false
        )
        window.SweetAlert.success(
          'Sửa mẫu CN',
          `Đã cập nhật mẫu chứng nhận "${templateTitle}" thành công!`,
          false
        )
        redirectToTemplates()
      }
    } catch (e: any) {
      if (e.response.status == 409) {
        window.SweetAlert.error(
          'Lỗi',
          `Đã tồn tại mẫu chứng nhận "${templateTitle}"`,
          false
        )
      } else {
        console.log('Lỗi lấy dữ liệu:', e)
      }
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleImageChange = async (files: any) => {
    try {
      const file = files[0]

      const isValidImg = await compressImageSize(file, 3371, 2420)

      if (isValidImg) {
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await axios.post(
            `${DASHBOARD_TEMPLATES_API_URL}/upload-image`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: (progressEvent: any) => {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                )
                setUploadProgress(progress)
              }
            }
          )

          setTemplateImg(response.data.url)
          window.SweetAlert.success(
            'Lưu hình ảnh',
            'Tải hình ảnh lên đám mây thành công',
            true
          )
        } catch (error: any) {
          window.SweetAlert.error(
            'Lỗi lưu hình ảnh',
            `Không thể lưu hình ảnh lên đám mây! Vui lòng thử lại!<br/>${error.message}`,
            false
          )
        }
      } else {
        window.SweetAlert.warning(
          'Hình ảnh không hợp lệ',
          `Hình ảnh <b>bắt buộc</b> phải có kích thước từ <b>3371x2420 pixels</b> trở lên`,
          false
        )
      }
    } catch (error: any) {
      // Xử lý lỗi
      window.SweetAlert.error(
        'Lỗi nhận hình ảnh',
        `Không thể nhận hình ảnh! Vui lòng thử lại!<br/>${error.message}`,
        false
      )
    }
  }

  return (
    <>
      <Title order={2}>
        {detectForm(id, 'Thêm mới', 'Sửa')} mẫu chứng nhận
      </Title>

      <Card my="lg" shadow="sm" radius="md" withBorder>
        {isGettingData ? (
          <>
            <Center>
              <Loader color="blue" size="md" />
            </Center>
          </>
        ) : (
          <form onSubmit={detectForm(id, addTemplate, editTemplate)}>
            <TextInput
              label="Tên mẫu chứng nhận"
              value={templateTitle}
              onChange={e => setTemplateTitle(e.target.value)}
              radius="md"
              required
              disabled={formIsLoading}
            />

            <Dropzone
              my="md"
              onDrop={files => handleImageChange(files)}
              onReject={files => {
                window.SweetAlert.warning(
                  'Đính kèm không hợp lệ',
                  `Đính kèm <b>bắt buộc</b> phải là 1 hình ảnh có kích thước từ <b>3371x2420 pixels</b> trở lên và <b>không quá 5MB</b>.`,
                  false
                )
              }}
              maxSize={getMegabyte(5)}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              loading={uploadProgress > 0 && uploadProgress < 100}
              disabled={formIsLoading}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: 'none' }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-blue-6)'
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-red-6)'
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-dimmed)'
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Kéo thả hoặc nhấn để chọn hình ảnh mẫu chứng nhận
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Hình ảnh phải có kích thước từ <b>3371x2420 pixels</b> trở
                    lên và <b>không quá 5MB</b>.
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {templateImg === '' ? null : (
              <>
                <TextInput
                  size="md"
                  required
                  name="templateImg"
                  value={templateImg}
                  style={{ display: 'none' }}
                  disabled
                />

                <Grid>
                  <Grid.Col span={6}>
                    {isCanvasLoading && (
                      <Center>
                        <Loader color="blue" mr="xs" /> Đang render hình ảnh...
                      </Center>
                    )}
                    <canvas style={{ width: '100%' }} ref={canvasRef} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Checkbox
                      label="Tiêu đề sự kiện"
                      checked={isDisplayEventTitle}
                      onChange={event =>
                        setIsDisplayEventTitle(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayEventTitle}
                          min={0}
                          max={3371}
                          value={eventTitleX}
                          onChange={setEventTitleX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayEventTitle}
                          min={0}
                          max={2420}
                          value={eventTitleY}
                          onChange={setEventTitleY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayEventTitle}
                          min={0}
                          max={130}
                          value={eventTitleFs}
                          onChange={setEventTitleFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayEventTitle}
                      value={eventTitleColor}
                      onChange={setEventTitleColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Đơn vị tổ chức"
                      checked={isDisplayCefHost}
                      onChange={event =>
                        setIsDisplayCefHost(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefHost}
                          min={0}
                          max={3371}
                          value={cefHostX}
                          onChange={setCefHostX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefHost}
                          min={0}
                          max={2420}
                          value={cefHostY}
                          onChange={setCefHostY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefHost}
                          min={0}
                          max={130}
                          value={cefHostFs}
                          onChange={setCefHostFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayCefHost}
                      value={cefHostColor}
                      onChange={setCefHostColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Tên sinh viên"
                      checked={isDisplayStudentName}
                      onChange={event =>
                        setIsDisplayStudentName(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayStudentName}
                          min={0}
                          max={3371}
                          value={studentNameX}
                          onChange={setStudentNameX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayStudentName}
                          min={0}
                          max={2420}
                          value={studentNameY}
                          onChange={setStudentNameY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayStudentName}
                          min={0}
                          max={130}
                          value={studentNameFs}
                          onChange={setStudentNameFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayStudentName}
                      value={studentNameColor}
                      onChange={setStudentNameColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Mã số sinh viên"
                      checked={isDisplayStudentCode}
                      onChange={event =>
                        setIsDisplayStudentCode(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayStudentCode}
                          min={0}
                          max={3371}
                          value={studentCodeX}
                          onChange={setStudentCodeX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayStudentCode}
                          min={0}
                          max={2420}
                          value={studentCodeY}
                          onChange={setStudentCodeY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayStudentCode}
                          min={0}
                          max={130}
                          value={studentCodeFs}
                          onChange={setStudentCodeFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayStudentCode}
                      value={studentCodeColor}
                      onChange={setStudentCodeColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Số chứng nhận"
                      checked={isDisplayCefNo}
                      onChange={event =>
                        setIsDisplayCefNo(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefNo}
                          min={0}
                          max={3371}
                          value={cefNoX}
                          onChange={setCefNoX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefNo}
                          min={0}
                          max={2420}
                          value={cefNoY}
                          onChange={setCefNoY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefNo}
                          min={0}
                          max={130}
                          value={cefNoFs}
                          onChange={setCefNoFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayCefNo}
                      value={cefNoColor}
                      onChange={setCefNoColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Ngày chứng nhận"
                      checked={isDisplayCefDay}
                      onChange={event =>
                        setIsDisplayCefDay(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefDay}
                          min={0}
                          max={3371}
                          value={cefDayX}
                          onChange={setCefDayX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefDay}
                          min={0}
                          max={2420}
                          value={cefDayY}
                          onChange={setCefDayY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefDay}
                          min={0}
                          max={130}
                          value={cefDayFs}
                          onChange={setCefDayFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayCefDay}
                      value={cefDayColor}
                      onChange={setCefDayColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Tháng chứng nhận"
                      checked={isDisplayCefMonth}
                      onChange={event =>
                        setIsDisplayCefMonth(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefMonth}
                          min={0}
                          max={3371}
                          value={cefMonthX}
                          onChange={setCefMonthX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefMonth}
                          min={0}
                          max={2420}
                          value={cefMonthY}
                          onChange={setCefMonthY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefMonth}
                          min={0}
                          max={130}
                          value={cefMonthFs}
                          onChange={setCefMonthFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayCefMonth}
                      value={cefMonthColor}
                      onChange={setCefMonthColor}
                      format="hex"
                      required
                    />

                    <Checkbox
                      mt="md"
                      label="Năm chứng nhận"
                      checked={isDisplayCefYear}
                      onChange={event =>
                        setIsDisplayCefYear(event.currentTarget.checked)
                      }
                      variant="outline"
                      disabled={formIsLoading}
                    />
                    <Grid>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Ngang: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefYear}
                          min={0}
                          max={3371}
                          value={cefYearX}
                          onChange={setCefYearX}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Dọc: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefYear}
                          min={0}
                          max={2420}
                          value={cefYearY}
                          onChange={setCefYearY}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Slider
                          label={value => `Cỡ chữ: ${value}pt`}
                          disabled={formIsLoading || !isDisplayCefYear}
                          min={0}
                          max={130}
                          value={cefYearFs}
                          onChange={setCefYearFs}
                        />
                      </Grid.Col>
                    </Grid>
                    <ColorInput
                      mt="xs"
                      disabled={formIsLoading || !isDisplayCefYear}
                      value={cefYearColor}
                      onChange={setCefYearColor}
                      format="hex"
                      required
                    />
                  </Grid.Col>
                </Grid>
              </>
            )}

            <Center>
              <Button
                mt="lg"
                color="green"
                type="submit"
                loading={formIsLoading}
              >
                {detectForm(id, 'Thêm', 'Cập nhật')}
              </Button>
            </Center>
          </form>
        )}
      </Card>
    </>
  )
}
