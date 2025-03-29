import express from 'express'
import { doc, getDoc } from 'firebase/firestore'

import { db } from '../firebase/config.js'
import { sendEmailEventReminder } from '../utils/sendEmail.js'

const router = express.Router()

router.post('/event-reminder', async (req, res) => {
  const { event, students } = req.body

  for (const studentId of students) {
    const docRef = doc(db, 'students-demo', studentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const docData = docSnap.data()

      if (docData.email !== '') {
        await sendEmailEventReminder(docData.email, event)
      }

      res.status(200).json()
    }
    res.status(400).json()
  }
})

export default router
