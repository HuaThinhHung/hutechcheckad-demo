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

import {
  createUserAuth,
  deleteUserAuth,
  updateUserAuth
} from '../firebase/admin.js'
import { db } from '../firebase/config.js'
import { fetchCollection } from '../utils/fetchCollection.js'
import { uuidv4 } from '../utils/uuid.js'

const router = express.Router()

router.post('/create', async (req, res) => {
  try {
    const { email, username, password, fullName, roleName } = req.body

    const uid = uuidv4()

    await createUserAuth(uid, email, password)
      .then(async () => {
        await setDoc(doc(db, 'accounts-demo', uid), {
          userId: uid,
          username: username,
          fullName: fullName,
          roleName: roleName,
          createdAt: Timestamp.now().toDate()
        })
        res.status(200).send('Đã tạo tài khoản mới thành công!')
      })
      .catch(err => {
        res.status(400).json({ message: err.message })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all', async (req, res) => {
  try {
    const data = await fetchCollection('accounts-demo')

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/find-by-role', async (req, res) => {
  try {
    const { roleName } = req.query

    const docsRef = query(
      collection(db, 'accounts-demo'),
      where('roleName', '==', roleName)
    )
    const docsSnap = await getDocs(docsRef)

    const accounts = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    res.status(200).json(accounts)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-name-by-id', async (req, res) => {
  try {
    const { uid } = req.query

    const userRef = doc(db, 'accounts-demo', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      res.status(200).json({ value: userSnap.data().fullName })
    } else {
      res.status(200).json({ value: '' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update', async (req, res) => {
  try {
    const { uid, username, password, fullName, roleName } = req.body

    await updateUserAuth(uid, password)
      .then(async () => {
        await updateDoc(doc(db, 'accounts-demo', uid), {
          userId: uid,
          username: username,
          fullName: fullName,
          roleName: roleName,
          editedAt: Timestamp.now().toDate()
        })
        res
          .status(200)
          .send('Đã cập nhật mật khẩu cho tài khoản này thành công!')
      })
      .catch(err => {
        res.status(400).json({ message: err.message })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { docId, userId } = req.body

    await deleteUserAuth(userId)
      .then(async () => {
        await deleteDoc(doc(db, 'accounts-demo', docId))
        res.status(200).send('Đã xóa tài khoản thành công!')
      })
      .catch(err => {
        res.status(400).json({ message: err.message })
      })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

export default router
