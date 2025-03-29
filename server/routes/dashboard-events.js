import express from 'express'
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'

import { db } from '../firebase/config.js'
import { fetchCollection } from '../utils/fetchCollection.js'
import { uuidv4 } from '../utils/uuid.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const {
      title,
      host,
      labels,
      date,
      room,
      template,
      allowExport,
      allowCheckin,
      display
    } = req.body

    const notExistEvent = await checkExistEvent(title)

    if (notExistEvent) {
      const genDocId = uuidv4()

      await setDoc(doc(db, 'events-demo', genDocId), {
        title: title,
        host: host,
        labels: labels,
        date: date,
        room: room,
        template: template,
        allowExport: allowExport,
        allowCheckin: allowCheckin,
        display: display,
        createdAt: Timestamp.now().toDate()
      })
      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Sự kiện này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all', async (req, res) => {
  try {
    const data = await fetchCollection('events-demo', 'date')

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-upcoming', async (req, res) => {
  try {
    const eventRef = collection(db, 'events-demo')
    const eventQuery = query(
      eventRef,
      where('date', '>', new Date().toISOString()),
      orderBy('date', 'asc')
    )
    const eventSnap = await getDocs(eventQuery)

    if (eventSnap.empty) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }

    const events = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all-events-checkin', async (req, res) => {
  try {
    const eventRef = collection(db, 'events-demo')
    const eventQuery = query(
      eventRef,
      where('allowCheckin', '==', true),
      orderBy('date', 'asc')
    )
    const eventSnap = await getDocs(eventQuery)

    if (!eventSnap.empty) {
      const events = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      res.status(200).json(events)
    } else {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Lỗi kết nối đến server', error: err.message })
  }
})

router.get('/get', async (req, res) => {
  try {
    const { eventId } = req.query

    const docRef = doc(db, 'events-demo', eventId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const docData = docSnap.data()
      res.status(200).json(docData)
    } else {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
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
      host,
      labels,
      date,
      room,
      template,
      allowExport,
      allowCheckin,
      display
    } = req.body

    const notExistEvent =
      tempTitle === title ? true : await checkExistEvent(title)

    if (notExistEvent) {
      await updateDoc(doc(db, 'events-demo', docId), {
        title: title,
        host: host,
        labels: labels,
        date: date,
        room: room,
        template: template,
        allowExport: allowExport,
        allowCheckin: allowCheckin,
        display: display,
        editedAt: Timestamp.now().toDate()
      })
      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Sự kiện này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update-allow-checkin', async (req, res) => {
  try {
    const { docId, allowCheckin } = req.body

    const eventRef = doc(db, 'events-demo', docId)

    await updateDoc(eventRef, {
      allowCheckin: allowCheckin
    })
      .then(() => {
        res.status(200).json({ message: 'Thành công' })
      })
      .catch(e => {
        res
          .status(500)
          .json({ message: `Không thể cập nhật trạng thái checkin: ${e}` })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update-display-event', async (req, res) => {
  try {
    const { docId, display } = req.body

    const eventRef = doc(db, 'events-demo', docId)

    await updateDoc(eventRef, {
      display: display
    })
      .then(() => {
        res.status(200).json({ message: 'Thành công' })
      })
      .catch(e => {
        res
          .status(500)
          .json({ message: `Không thể cập nhật trạng thái checkin: ${e}` })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/pre-registration', async (req, res) => {
  try {
    const { evId, studentId } = req.body

    const eventRef = doc(db, 'events-demo', evId)

    await updateDoc(eventRef, {
      preRegistration: arrayUnion(studentId)
    })
      .then(() => {
        res.status(200).json({ message: 'Thành công' })
      })
      .catch(e => {
        res.status(500).json({ message: `Không thể đăng ký trước: ${e}` })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { eventId } = req.body

    await deleteDoc(doc(db, 'events-demo', eventId))
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

const checkExistEvent = async title => {
  const docRef = query(
    collection(db, 'events-demo'),
    where('title', '==', title)
  )
  const docsSnap = await getDocs(docRef)

  return docsSnap.empty
}

export default router
