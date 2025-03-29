import express from 'express'
import { doc, getDoc } from 'firebase/firestore'
import jwt from 'jsonwebtoken'

import { db } from '../firebase/config.js'
import { generateOTP } from '../utils/otp.js'
import { sendOTPEmail, sendOTPVerifyEmail } from '../utils/sendEmail.js'

const router = express.Router()

let refreshTokens = []
let activeOTP = {}
let verifyEmail = {}

router.get('/', authenticateToken, async (req, res) => {
  try {
    const studentsCollectionRef = doc(
      db,
      'students-demo',
      req.student.studentId
    )
    const studentsSnapshot = await getDoc(studentsCollectionRef)

    if (studentsSnapshot.exists()) {
      const studentData = studentsSnapshot.data()
      res.status(200).json({
        studentId: studentData.studentId,
        fullName: studentData.fullName,
        email: studentData.email
      })
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/login', async (req, res) => {
  const studentId = req.body.studentId

  const studentsCollectionRef = doc(db, 'students-demo', studentId)
  const studentsSnapshot = await getDoc(studentsCollectionRef)

  if (studentsSnapshot.exists()) {
    const student = { studentId: studentId }
    const accessToken = generateAccessToken(student)
    const refreshToken = jwt.sign(
      student,
      process.env.LAHM_REFRESH_TOKEN_SECRET
    )
    refreshTokens.push(refreshToken)
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken })
  } else {
    res.status(404).json()
  }
})

router.post('/request-otp', async (req, res) => {
  const studentId = req.body.studentId

  const docRef = doc(db, 'students-demo', studentId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const docData = docSnap.data()
    const otp = generateOTP()

    activeOTP[docData.studentId] = {
      otp: otp,
      createdAt: new Date()
    }
    await sendOTPEmail(docData.email, otp)

    return res.status(200).json()
  }
  return res.status(400).json()
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { studentId, otp } = req.body

    if (!activeOTP[studentId] || activeOTP[studentId].otp !== otp) {
      return res.status(400).json({ message: 'Mã OTP không chính xác.' })
    }

    const currentTime = new Date()
    const otpCreationTime = activeOTP[studentId].createdAt
    const timeDifference = (currentTime - otpCreationTime) / 1000
    if (timeDifference > 180) {
      delete activeOTP[studentId]
      return res.status(401).json({ message: 'Mã OTP này đã hết hạn.' })
    }

    delete activeOTP[studentId]

    const student = { studentId: studentId }
    const accessToken = generateAccessToken(student)
    const refreshToken = jwt.sign(
      student,
      process.env.LAHM_REFRESH_TOKEN_SECRET
    )
    refreshTokens.push(refreshToken)
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/request-verify-email', async (req, res) => {
  const { studentId, email } = req.body

  const docRef = doc(db, 'students-demo', studentId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const docData = docSnap.data()
    const otp = generateOTP()

    verifyEmail[docData.studentId] = {
      email: email,
      otp: otp,
      createdAt: new Date()
    }
    await sendOTPVerifyEmail(studentId, email, otp)

    return res.status(200).json()
  }
  return res.status(400).json()
})

router.post('/verify-email-otp', async (req, res) => {
  try {
    const { studentId, email, otp } = req.body

    if (!verifyEmail[studentId] || verifyEmail[studentId].otp !== otp) {
      return res.status(400).json({ message: 'Mã OTP không chính xác.' })
    }

    if (verifyEmail[studentId].email !== email) {
      return res.status(400).json({
        message:
          'Địa chỉ email có sự thay đổi. Yêu cầu gửi mã mới nếu thay đổi.'
      })
    }

    const currentTime = new Date()
    const otpCreationTime = verifyEmail[studentId].createdAt
    const timeDifference = (currentTime - otpCreationTime) / 1000
    if (timeDifference > 180) {
      delete verifyEmail[studentId]
      return res.status(401).json({ message: 'Mã OTP này đã hết hạn.' })
    }

    delete verifyEmail[studentId]

    res.status(200).json({})
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.status(200).json()
})

function generateAccessToken(student) {
  return jwt.sign(student, process.env.LAHM_ACCESS_TOKEN_SECRET, {
    expiresIn: '900s'
  })
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.LAHM_ACCESS_TOKEN_SECRET, (err, student) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.student = student
    next()
  })
}

export default router
