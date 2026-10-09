import * as admin from 'firebase-admin';

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (isFirebaseAdminConfigured) {
    try {
      const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
    } catch (e) {
      console.warn('[Firebase Admin] Failed to initialize with cert credentials, using default', e);
      return admin.initializeApp();
    }
  }

  // Fallback app for environments without cloud service account
  return admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  });
}

const adminApp = initAdmin();
export const adminAuth = admin.auth(adminApp);
export const adminFirestore = admin.firestore(adminApp);
export const adminStorage = admin.storage(adminApp);
