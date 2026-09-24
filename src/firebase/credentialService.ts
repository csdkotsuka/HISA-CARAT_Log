import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';

export interface UserCredential {
  email: string;
  role: 'admin' | 'provider' | 'customer';
  passwordHash: string; // Stored password string
  tenantId?: string;
  customerId?: string;
  updatedAt: string;
}

const CRED_LOCAL_PREFIX = 'cheer_cred_';

/**
 * Save user password to both LocalStorage and Cloud Firestore (collection: 'user_credentials')
 */
export const saveUserPassword = async (
  email: string,
  newPassword: string,
  role: 'admin' | 'provider' | 'customer',
  tenantId?: string,
  customerId?: string
): Promise<void> => {
  const normalized = email.trim().toLowerCase();
  const cred: UserCredential = {
    email: normalized,
    role,
    passwordHash: newPassword,
    tenantId,
    customerId,
    updatedAt: new Date().toISOString(),
  };

  // 1. LocalStorage for offline and instant responsiveness
  try {
    localStorage.setItem(`${CRED_LOCAL_PREFIX}${normalized}`, JSON.stringify(cred));
  } catch (e) {
    console.error('Failed to save credential to localStorage:', e);
  }

  // 2. Firestore collection 'user_credentials' for cloud persistence across devices
  try {
    const docRef = doc(db, 'user_credentials', normalized);
    await setDoc(docRef, cred, { merge: true });
    console.log(`🔐 Password saved to Firestore for ${normalized}`);
  } catch (e) {
    console.warn('Failed to save credential to Firestore:', e);
  }
};

/**
 * Get user credential from LocalStorage or Firestore
 */
export const getUserCredential = async (
  email: string
): Promise<UserCredential | null> => {
  const normalized = email.trim().toLowerCase();

  // 1. Check local cache first
  try {
    const raw = localStorage.getItem(`${CRED_LOCAL_PREFIX}${normalized}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  // 2. Query Cloud Firestore
  try {
    const docRef = doc(db, 'user_credentials', normalized);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as UserCredential;
      try {
        localStorage.setItem(`${CRED_LOCAL_PREFIX}${normalized}`, JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch credential from Firestore:', e);
  }

  return null;
};

/**
 * Verify user password during login.
 * - If no password has ever been set: allows login (initial state: empty password or any password).
 * - If password has been set: verifies against the stored password.
 */
export const verifyUserPassword = async (
  email: string,
  enteredPassword: string
): Promise<{ success: boolean; isInitial: boolean; message?: string }> => {
  const normalized = email.trim().toLowerCase();
  const cred = await getUserCredential(normalized);

  // If no password set yet in Firestore or localStorage
  if (!cred || !cred.passwordHash) {
    return { success: true, isInitial: true };
  }

  // Compare entered password with stored password
  if (cred.passwordHash === enteredPassword.trim()) {
    return { success: true, isInitial: false };
  }

  return {
    success: false,
    isInitial: false,
    message: 'パスワードが正しくありません。変更後のパスワードを入力してください。',
  };
};
