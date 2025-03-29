import express from 'express'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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
    const { name, color } = req.body

    const notExistLabel = await checkExistLabel(name)

    if (notExistLabel) {
      const genId = uuidv4()

      await setDoc(doc(db, 'labels-demo', genId), {
        name: name,
        color: color,
        createdAt: Timestamp.now().toDate()
      })
      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Nhãn chủ đề này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all', async (req, res) => {
  try {
    const data = await fetchCollection('labels-demo')

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
    const { labelId } = req.query

    const docRef = doc(db, 'labels-demo', labelId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      res.status(200).json(docSnap.data())
    } else {
      res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/find-by-name', async (req, res) => {
  try {
    const { name } = req.query

    const docRef = query(
      collection(db, 'labels-demo'),
      where('name', '==', name)
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
    const { docId, name, color } = req.body

    const notExistHost = await checkExistLabel(name)

    if (notExistHost) {
      await updateDoc(doc(db, 'labels-demo', docId), {
        name: name,
        color: color,
        editedAt: Timestamp.now().toDate()
      })
      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Nhãn chủ đề này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { docId } = req.body

    await deleteDoc(doc(db, 'labels-demo', docId))
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

const checkExistLabel = async name => {
  const docRef = query(collection(db, 'labels-demo'), where('name', '==', name))
  const docsSnap = await getDocs(docRef)

  return docsSnap.empty
}

export default router
