import { collection, getDocs, orderBy, query } from 'firebase/firestore'

import { db } from '../firebase/config.js'

export async function fetchCollection(
  collectionName,
  sortBy = 'createdAt',
  direction = 'desc'
) {
  try {
    const docRef = collection(db, collectionName)
    const q = query(docRef, orderBy(sortBy, direction))
    const snapshot = await getDocs(q)

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return data
  } catch (error) {
    return []
  }
}
