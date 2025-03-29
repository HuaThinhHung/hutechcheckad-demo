import express from 'express'
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore'

import { db } from '../firebase/config.js'
import { fetchCollection } from '../utils/fetchCollection.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const { studentId, fullName, studyClass, isMonitor, email, phone } =
      req.body

    await setDoc(doc(db, 'students-demo', studentId), {
      studentId: studentId,
      fullName: fullName,
      studyClass: studyClass,
      isMonitor: isMonitor,
      email: email,
      phone: phone,
      createdAt: Timestamp.now().toDate()
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/add-null', async (req, res) => {
  try {
    const { studentId } = req.body
    await setDoc(doc(db, 'students-demo', studentId), {
      studentId: studentId,
      fullName: '',
      studyClass: '',
      isMonitor: false,
      email: '',
      phone: '',
      createdAt: Timestamp.now().toDate()
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all', async (req, res) => {
  try {
    const data = await fetchCollection('students-demo')

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-by-id', async (req, res) => {
  try {
    const { studentId } = req.query
    const studentRef = doc(db, 'students-demo', studentId)
    const studentDoc = await getDoc(studentRef)
    if (studentDoc.exists()) {
      const studentData = studentDoc.data()
      res.status(200).json(studentData)
    } else {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/check-exist-student-id', async (req, res) => {
  try {
    const { studentId } = req.query
    const docRef = doc(db, 'students-demo', studentId)
    const docSnap = await getDoc(docRef)
    res.status(200).json({ value: docSnap.exists() })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update', async (req, res) => {
  try {
    const { studentId, fullName, studyClass, isMonitor, email, phone } =
      req.body

    await updateDoc(doc(db, 'students-demo', studentId), {
      studentId: studentId,
      fullName: fullName,
      studyClass: studyClass,
      isMonitor: isMonitor,
      email: email,
      phone: phone,
      editedAt: Timestamp.now().toDate()
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update-student-info', async (req, res) => {
  try {
    const { studentId, fullName, email, phone } = req.body

    await updateDoc(doc(db, 'students-demo', studentId), {
      fullName: fullName,
      email: email,
      phone: phone,
      editedAt: Timestamp.now().toDate()
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { studentId } = req.body
    await deleteDoc(doc(db, 'students-demo', studentId))
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

export default router
