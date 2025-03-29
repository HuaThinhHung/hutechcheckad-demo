import express from 'express'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from '../firebase/config.js'

const router = express.Router()

router.get('/get', async (req, res) => {
  try {
    const docRef = doc(db, 'system-demo', 'configuration')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const docData = docSnap.data()
      res.status(200).json(docData)
    } else {
      res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-student-id-pattern', async (req, res) => {
  try {
    const docRef = doc(db, 'system-demo', 'configuration')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const studentIdPattern = docSnap.data().regexCheckStudentId
      res.status(200).json(studentIdPattern)
    } else {
      res.status(200).json('')
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-is-require-student-login', async (req, res) => {
  try {
    const docRef = doc(db, 'system-demo', 'configuration')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const isRequireStudentLogin = docSnap.data().isRequireStudentLogin
      res.status(200).json(isRequireStudentLogin)
    } else {
      res.status(200).json(false)
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update', async (req, res) => {
  try {
    const {
      systemEmail,
      systemEmailPw,
      regexCheckStudentId,
      isEmailNotify,
      isRequireStudentLogin
    } = req.body

    await setDoc(doc(db, 'system-demo', 'configuration'), {
      systemEmail: systemEmail,
      systemEmailPw: systemEmailPw,
      regexCheckStudentId: regexCheckStudentId,
      isEmailNotify: isEmailNotify,
      isRequireStudentLogin: isRequireStudentLogin
    })
      .then(() => {
        res.status(200).json()
      })
      .catch(e => {
        res.status(400).json({ message: 'Lỗi cập nhật' })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

export default router
