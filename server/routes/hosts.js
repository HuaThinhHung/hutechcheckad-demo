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
    const { name, symbol } = req.body

    const notExistHost = await checkExistHost(name)

    if (notExistHost) {
      const genId = uuidv4()

      await setDoc(doc(db, 'hosts-demo', genId), {
        hostId: genId,
        name: name,
        symbol: symbol,
        createdAt: Timestamp.now().toDate()
      })
      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Đơn vị này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-all', async (req, res) => {
  try {
    const data = await fetchCollection('hosts-demo')

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-cert-suffix', async (req, res) => {
  try {
    const { host } = req.query
    const docSnap = await getDoc(doc(db, 'hosts-demo', host))

    if (docSnap.exists()) {
      res
        .status(200)
        .json({ value: `CN${getCertYear(new Date())}${docSnap.data().symbol}` })
    } else {
      res.status(200).json({ value: '' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.get('/get-by-id', async (req, res) => {
  try {
    const { hostId } = req.query

    const docRef = doc(db, 'hosts-demo', hostId)
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

router.get('/get-name-by-id', async (req, res) => {
  try {
    const { hostId } = req.query

    const docRef = doc(db, 'hosts-demo', hostId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const docData = docSnap.data()
      const name = docData.name
      res.status(200).json(name)
    } else {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/update', async (req, res) => {
  try {
    const { docId, name, symbol } = req.body

    const notExistHost = await checkExistHost(name)

    if (notExistHost) {
      await updateDoc(doc(db, 'hosts-demo', docId), {
        name: name,
        symbol: symbol,
        editedAt: Timestamp.now().toDate()
      })
      res.status(200).json({ message: 'Thành công' })
    } else {
      res.status(409).json({ message: 'Đơn vị này đã tồn tại' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/find-and-delete-all-info', async (req, res) => {
  try {
    const { hostId, accounts } = req.body

    const evsRef = query(
      collection(db, 'events-demo'),
      where('host', '==', hostId)
    )
    const evsSnap = await getDocs(evsRef)

    if (!evsSnap.empty) {
      const removeListener = evsSnap.docs.map(async ev => {
        await updateDoc(doc(db, 'events-demo', ev.id), {
          host: ''
        })
      })

      await Promise.all(removeListener)
    }

    accounts.map(async account => {
      const certsRef = query(
        collection(db, 'certs-demo'),
        where('checkinBy', '==', account.id)
      )
      const certsSnap = await getDocs(certsRef)

      if (!certsSnap.empty) {
        const removeListener = certsSnap.docs.map(async cert => {
          await updateDoc(doc(db, 'certs-demo', cert.id), {
            checkinBy: ''
          })
        })

        await Promise.all(removeListener)
      }
    })

    res.status(200).json()
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { docId } = req.body

    await deleteDoc(doc(db, 'hosts-demo', docId))
    res.status(200).json({ message: 'Thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kết nối đến server' })
  }
})

const checkExistHost = async name => {
  const docRef = query(collection(db, 'hosts-demo'), where('name', '==', name))
  const docsSnap = await getDocs(docRef)

  return docsSnap.empty
}

const getCertYear = date => {
  let certYear

  const mocNgay = 18
  const mocThang = 7

  const string = new Date(date)
  const ngay = string.getDate()
  const thang = string.getMonth() + 1
  const nam = string.getFullYear().toString().slice(-2)

  if (ngay >= mocNgay && thang >= mocThang) {
    certYear = `${nam}${Number(nam) + 1}`
  } else {
    certYear = `${Number(nam) - 1}${nam}`
  }

  return certYear
}

export default router
