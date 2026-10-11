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
  // Clear session cookie across subdomains and local
  document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT${domainAttr};`;
  document.cookie = `dev_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT${domainAttr};`;
  document.cookie = `user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT${domainAttr};`;
  document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  document.cookie = `dev_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  document.cookie = `user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function syncSessionToken(token: string, uid: string, email: string, displayName?: string) {
  // Store in cookie for Next.js SSR and server route handlers (shared across .qwenton.shop)
  const domainAttr = getCookieDomain();
  const maxAge = 2592000; // 30 days in seconds
  document.cookie = `session=${token}; path=/; max-age=${maxAge}; SameSite=Lax${domainAttr}`;
  document.cookie = `dev_user_id=${uid}; path=/; max-age=${maxAge}; SameSite=Lax${domainAttr}`;
  document.cookie = `user_email=${encodeURIComponent(email)}; path=/; max-age=${maxAge}; SameSite=Lax${domainAttr}`;

  // Also set local path cookies as fallback
  document.cookie = `session=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `dev_user_id=${uid}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_email=${encodeURIComponent(email)}; path=/; max-age=${maxAge}; SameSite=Lax`;

  try {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid, email, displayName }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== 'undefined') {
        if (data.user) {
          localStorage.setItem('qwenton_cached_user', JSON.stringify(data.user));
        }
        if (data.entitlements) {
          localStorage.setItem('qwenton_cached_entitlements', JSON.stringify(data.entitlements));
        }
      }
    }
  } catch (e) {
    console.warn('Session sync warning:', e);
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
  }

  // If currentUser is still restoring from IndexedDB on page load, wait for onAuthStateChanged
  return new Promise((resolve) => {
    let resolved = false;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (resolved) return;
      resolved = true;
      unsubscribe();
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        unsubscribe();
        resolve(null);
      }
    }, 1500);
  });
}
