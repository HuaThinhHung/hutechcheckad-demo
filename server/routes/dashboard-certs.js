import express from 'express'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'

import { db } from '../firebase/config.js'
import { formatTimestamp } from '../utils/datetime.js'

const router = express.Router()

router.get('/get-all', async (req, res) => {
  try {
    let certsData = []
    let dataLoaded = false

    const evsRef = collection(db, 'certs-demo')
    const evQuery = await query(evsRef, orderBy('checkinAt', 'desc'))
    await onSnapshot(evQuery, async snapshot => {
      const allCefData = await Promise.all(
        snapshot.docs.map(async snap => {
          const certDoc = snap.data()

          const checkinAt = formatTimestamp(certDoc.checkinAt?.seconds)
          const checkoutAt =
            certDoc.checkoutAt !== ''
              ? formatTimestamp(certDoc.checkoutAt?.seconds)
              : ''

          const certData = {
            id: snap.id,
            certId: certDoc.certId,
            studentId: certDoc.studentId,
            eventId: certDoc.eventId,
            checkinAt,
            checkoutAt
          }

          return { ...certData }
        })
      )

      let certsDataPromises = []
      for (const item of allCefData) {
        if (item.checkoutAt === '') {
          const getData = getPromiseData(item.eventId, item.studentId)
          certsDataPromises.push(
            getData.then(({ stData, evData }) => ({
              id: item.id,
              certId: item.certId,
              studentId: item.studentId,
              checkinAt: item.checkinAt,
              stData,
              evData
            }))
          )
        }
      }

      const getData = await Promise.all(certsDataPromises)
      certsData = getData.filter(
        item => item !== undefined && item !== null && item.evData.display
      )

      dataLoaded = true
    })

    const waitForData = setInterval(() => {
      if (dataLoaded) {
        clearInterval(waitForData)
        res.status(200).json(certsData)
      }
    }, 100)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-cert-id', async (req, res) => {
  try {
    const { suffix } = req.query

    const docsRef = query(
      collection(db, 'certs-demo'),
      where('suffix', '==', suffix)
    )
    const docSnap = await getDocs(docsRef)

    const existingIds = docSnap.docs
      .map(doc => {
        const match = doc.data().certId.match(/^(\d+)\//)
        return match ? parseInt(match[1], 10) : null
      })
      .filter(Number.isInteger)

    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1

    res.status(200).json({ value: nextId })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/check-student-checked-in', async (req, res) => {
  try {
    const { evId, stId } = req.query

    const docRef = doc(db, 'certs-demo', `${evId}_${stId}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const docData = docSnap.data()
      const isCheckedOut = docData.checkoutAt

      if (isCheckedOut === '') {
        res.status(200).json({ value: 1 })
      } else if (isCheckedOut !== '') {
        res.status(200).json({ value: 2 })
      }
    } else {
      res.status(200).json({ value: 0 })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/find-by-event-id', async (req, res) => {
  try {
    const { evId } = req.query

    const docsRef = query(
      collection(db, 'certs-demo'),
      where('eventId', '==', evId)
    )
    const docsSnap = await getDocs(docsRef)

    const certs = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    res.status(200).json(certs)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/find-by-student-id', async (req, res) => {
  try {
    const { stId } = req.query

    const docsRef = query(
      collection(db, 'certs-demo'),
      where('studentId', '==', stId)
    )
    const docsSnap = await getDocs(docsRef)

    const certs = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    res.status(200).json(certs)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/checkin', async (req, res) => {
  try {
    const { evId, studentId, certId, certSuffix, userId } = req.body

    await setDoc(doc(db, 'certs-demo', `${evId}_${studentId}`), {
      certId: `${certId}/${certSuffix}`,
      suffix: certSuffix,
      studentId: studentId,
      eventId: evId,
      checkinAt: Timestamp.now().toDate(),
      checkinBy: userId,
      checkoutAt: ''
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/checkout', async (req, res) => {
  try {
    const { evId, studentId } = req.body

    await updateDoc(doc(db, 'certs-demo', `${evId}_${studentId}`), {
      checkoutAt: Timestamp.now().toDate()
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/checkin-again', async (req, res) => {
  try {
    const { evId, studentId } = req.body

    await updateDoc(doc(db, 'certs-demo', `${evId}_${studentId}`), {
      checkoutAt: ''
    })
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { docId } = req.body

    await deleteDoc(doc(db, 'certs-demo', docId))
    res.status(200).send('Đã xóa chứng nhận thành công!')
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

const getPromiseData = async (eventId, studentId) => {
  let stData = []
  const stSnap = await getDoc(doc(db, 'students-demo', studentId))
  if (stSnap.exists()) {
    stData = stSnap.data()
  }

  let evData = []
  const evSnap = await getDoc(doc(db, 'events-demo', eventId))
  if (evSnap.exists()) {
    evData = evSnap.data()
  }

  return { stData, evData }
}

export default router
