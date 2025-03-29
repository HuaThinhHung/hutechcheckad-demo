import express from 'express'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { fbAdmin } from '../firebase/admin.js'
import { auth, db } from '../firebase/config.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    const idToken = await user.getIdToken()

    const accountsQuery = query(
      collection(db, 'accounts-demo'),
      where('userId', '==', user.uid)
    )
    const accountsSnapshot = await getDocs(accountsQuery)

    if (accountsSnapshot.empty) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại' })
    }

    let accountData = null
    for (const doc of accountsSnapshot.docs) {
      accountData = doc.data()
    }

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token: idToken,
      user: {
        email: user.email,
        fullName: accountData.fullName,
        userID: user.uid,
        roleId: accountData.roleName
      }
    })
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Đăng nhập thất bại', error: error.message })
  }
})

router.get('/check-session', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await fbAdmin.auth().verifyIdToken(token)
    const userId = decodedToken.uid

    const accountsQuery = query(
      collection(db, 'accounts-demo'),
      where('userId', '==', userId)
    )
    const accountsSnapshot = await getDocs(accountsQuery)

    if (accountsSnapshot.empty) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại' })
    }

    let accountData = null
    for (const doc of accountsSnapshot.docs) {
      accountData = doc.data()
    }

    return res.status(200).json({
      message: 'Người dùng đã đăng nhập',
      user: {
        email: decodedToken.email,
        fullName: accountData.fullName,
        userID: userId,
        roleId: accountData.roleName
      }
    })
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'Token không hợp lệ', error: error.message })
  }
})

export default router
