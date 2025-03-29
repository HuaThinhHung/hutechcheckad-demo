import dotenv from 'dotenv'
import admin from 'firebase-admin'

dotenv.config()

const serviceAccount = JSON.parse(
  Buffer.from(process.env.LAHM_PUBLIC_FIREBASE_ADMIN, 'base64').toString('utf8')
)

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hutech-checkin-default-rtdb.firebaseio.com',
  storageBucket: 'hutech-checkin.appspot.com'
}

export const fbAdmin = admin.initializeApp(firebaseConfig)
export const fbAdminBucket = fbAdmin.storage().bucket()

export async function createUserAuth(uid, email, password) {
  await admin.auth().createUser({
    uid: uid,
    email: email,
    emailVerified: true,
    password: password,
    disabled: false
  })
}

export async function updateUserAuth(uid, password) {
  await admin.auth().updateUser(uid, {
    password: password
  })
}

export async function deleteUserAuth(userId) {
  await admin.auth().deleteUser(userId)
}
