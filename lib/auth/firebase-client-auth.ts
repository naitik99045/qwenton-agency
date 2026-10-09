import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';

export async function loginWithEmail(email: string, pass: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const token = await userCredential.user.getIdToken();
  // Sync token to cookie/session
  await syncSessionToken(token, userCredential.user.uid, userCredential.user.email || '');
  return userCredential.user;
}

export async function signUpWithEmail(email: string, pass: string, displayName?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  const token = await userCredential.user.getIdToken();
  await syncSessionToken(token, userCredential.user.uid, email, displayName);
  return userCredential.user;
}

export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const token = await userCredential.user.getIdToken();
  await syncSessionToken(
    token,
    userCredential.user.uid,
    userCredential.user.email || '',
    userCredential.user.displayName || undefined
  );
  return userCredential.user;
}

function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (host.endsWith('qwenton.shop')) {
    return '; domain=.qwenton.shop';
  }
  return '';
}

export async function logoutUser() {
  await signOut(auth);
  const domainAttr = getCookieDomain();
  // Clear session cookie across subdomains
  document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT${domainAttr};`;
  document.cookie = `dev_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT${domainAttr};`;
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

async function syncSessionToken(token: string, uid: string, email: string, displayName?: string) {
  // Store in cookie for Next.js SSR and server route handlers (shared across .qwenton.shop)
  const domainAttr = getCookieDomain();
  document.cookie = `session=${token}; path=/; max-age=604800; SameSite=Lax${domainAttr}`;
  document.cookie = `dev_user_id=${uid}; path=/; max-age=604800; SameSite=Lax${domainAttr}`;

  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid, email, displayName }),
    });
  } catch (e) {
    console.warn('Session sync warning:', e);
  }
}
