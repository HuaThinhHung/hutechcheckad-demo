import { format } from 'node:util'

import express from 'express'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import multer from 'multer'

import { fbAdminBucket } from '../firebase/admin.js'
import { db } from '../firebase/config.js'
import { fetchCollection } from '../utils/fetchCollection.js'

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const {
      title,
      image,
      // Tiêu đề sự kiện
      isDisplayEventTitle,
      eventTitleX,
      eventTitleY,
      eventTitleFs,
      eventTitleColor,
      // Đơn vị tổ chức
      isDisplayCefHost,
      cefHostX,
      cefHostY,
      cefHostFs,
      cefHostColor,
      // Tên sinh viên
      isDisplayStudentName,
      studentNameX,
      studentNameY,
      studentNameFs,
      studentNameColor,
      // Mã số sinh viên
      isDisplayStudentCode,
      studentCodeX,
      studentCodeY,
      studentCodeFs,
      studentCodeColor,
      // Số chứng nhận
      isDisplayCefNo,
      cefNoX,
      cefNoY,
      cefNoFs,
      cefNoColor,
      // Ngày chứng nhận
      isDisplayCefDay,
      cefDayX,
      cefDayY,
      cefDayFs,
      cefDayColor,
      // Tháng chứng nhận
      isDisplayCefMonth,
      cefMonthX,
      cefMonthY,
      cefMonthFs,
      cefMonthColor,
      // Năm chứng nhận
      isDisplayCefYear,
      cefYearX,
      cefYearY,
      cefYearFs,
      cefYearColor
    } = req.body

    const notExistTemplate = await checkExistTemplate(title)

    if (notExistTemplate) {
      await addDoc(collection(db, 'templates-demo'), {
        title: title,
        image: image,
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
        cefYearColor: cefYearColor,
        //
        createdAt: Timestamp.now().toDate()
      })

      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Mẫu chứng nhận này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all', async (req, res) => {
  try {
    const data = await fetchCollection('templates-demo')

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get', async (req, res) => {
  try {
    const { templateId } = req.query

    const templateRef = doc(db, 'templates-demo', templateId)
    const templateSnap = await getDoc(templateRef)

    if (templateSnap.exists()) {
      const docData = templateSnap.data()
      res.status(200).json(docData)
    } else {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/find-by-title', async (req, res) => {
  try {
    const { title } = req.query

    const docRef = query(
      collection(db, 'templates-demo'),
      where('title', '==', title)
    )
    const docsSnap = await getDocs(docRef)
    const docData = docsSnap.docs[0].data()

    res.status(200).json(docData)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update', async (req, res) => {
  try {
    const {
      docId,
      title,
      tempTitle,
      image,
      // Tiêu đề sự kiện
      isDisplayEventTitle,
      eventTitleX,
      eventTitleY,
      eventTitleFs,
      eventTitleColor,
      // Đơn vị tổ chức
      isDisplayCefHost,
      cefHostX,
      cefHostY,
      cefHostFs,
      cefHostColor,
      // Tên sinh viên
      isDisplayStudentName,
      studentNameX,
      studentNameY,
      studentNameFs,
      studentNameColor,
      // Mã số sinh viên
      isDisplayStudentCode,
      studentCodeX,
      studentCodeY,
      studentCodeFs,
      studentCodeColor,
      // Số chứng nhận
      isDisplayCefNo,
      cefNoX,
      cefNoY,
      cefNoFs,
      cefNoColor,
      // Ngày chứng nhận
      isDisplayCefDay,
      cefDayX,
      cefDayY,
      cefDayFs,
      cefDayColor,
      // Tháng chứng nhận
      isDisplayCefMonth,
      cefMonthX,
      cefMonthY,
      cefMonthFs,
      cefMonthColor,
      // Năm chứng nhận
      isDisplayCefYear,
      cefYearX,
      cefYearY,
      cefYearFs,
      cefYearColor
    } = req.body

    const notExistTemplate =
      title === tempTitle ? true : await checkExistTemplate(title)

    if (notExistTemplate) {
      await updateDoc(doc(db, 'templates-demo', docId), {
        title: title,
        image: image,
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
        cefYearColor: cefYearColor,
        //
        editedAt: Timestamp.now().toDate()
      })

      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Mẫu chứng nhận này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.file
    const fileName = `templates-demo/${Date.now()}-${file.originalname}`
    const fileUpload = fbAdminBucket.file(fileName)

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    let progress = 0
    blobStream.on('progress', chunk => {
      progress += chunk.length
    })

    blobStream.on('error', error => {
      res.status(500).json({ error: 'Upload failed', details: error.message })
    })

    blobStream.on('finish', async () => {
      await fileUpload.makePublic()

      const publicUrl = format(
        `https://storage.googleapis.com/${fbAdminBucket.name}/${fileName}`
      )

      res.status(200).json({
        message: 'Upload successful',
        url: publicUrl
      })
    })

    blobStream.end(file.buffer)
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message })
  }
})

const checkExistTemplate = async templateTitle => {
  const docRef = query(
    collection(db, 'templates-demo'),
    where('title', '==', templateTitle)
  )
  const docsSnap = await getDocs(docRef)

  return docsSnap.empty
}

export default router
