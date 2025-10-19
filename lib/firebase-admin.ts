import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

let adminApp: any = null
let adminDb: any = null
let adminAuth: any = null
let isInitialized = false

try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  // Only initialize if all required credentials are present
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }

    const apps = getApps()
    adminApp = apps.length === 0 ? initializeApp(cert(serviceAccount)) : apps[0]
    adminDb = getFirestore(adminApp)
    adminAuth = getAuth(adminApp)
    isInitialized = true
  }
} catch (error) {
  console.error("[Firebase Admin] Initialization error:", error)
  // Continue without Firebase Admin - routes will handle gracefully
}

export { adminDb, adminAuth, isInitialized }
