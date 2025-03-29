import express from 'express'
import { doc, getDoc } from 'firebase/firestore'

import { db } from '../firebase/config.js'
import { sendEmailCheckin } from '../utils/sendEmail.js'

const router = express.Router()

router.post('/thank-you', async (req, res) => {
  const { eventName, studentId } = req.body

  const configRef = doc(db, 'system-demo', 'configuration')
  const configSnap = await getDoc(configRef)
  if (configSnap.exists()) {
    if (configSnap.data().isEmailNotify) {
      const docRef = doc(db, 'students-demo', studentId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const docData = docSnap.data()

        if (
          docData.email !== '' &&
          docData.studentId !== '' &&
          docData.fullName !== ''
        ) {
          await sendEmailCheckin(
            docData.email,
            eventName,
            `${docData.studentId.slice(-4)}_${docData.fullName}`
          )
        }

        res.status(200).json()
      }
      res.status(400).json()
    }
  }
})

export default router
