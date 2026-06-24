import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAxgNCPPqXglJq2hElNiG228m4yZG-hBdE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'history-1ff3f.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'history-1ff3f',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'history-1ff3f.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '591931161212',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:591931161212:web:a15784a24d19c22b35e7f9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-C6GRGXCRPV',
};

const requiredFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredFirebaseConfig.every(Boolean);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analyticsPromise =
  app && firebaseConfig.measurementId ? isSupported().then((supported) => (supported ? getAnalytics(app) : null)) : null;

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export function subscribeToAuth(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export function signInWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured.');
  return signInWithPopup(auth, provider);
}

export function signOutUser() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export async function upsertUserProfile(user, role) {
  if (!db || !user) return;
  const baseProfile = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    role,
    updatedAt: serverTimestamp(),
  };

  await setDoc(
    doc(db, 'users', user.uid),
    baseProfile,
    { merge: true },
  );

  if (role === 'student') {
    await setDoc(
      doc(db, 'studentDirectory', user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        grade: '중1',
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}

export async function listStudentUsers() {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, 'studentDirectory'));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => (a.displayName || a.email || '').localeCompare(b.displayName || b.email || ''));
}

export async function listStudyLogs(uid) {
  if (!db || !uid) return [];
  const snapshot = await getDocs(collection(db, 'studyLogs', uid, 'logs'));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function approveStudentForParent(parentUser, student) {
  if (!db || !parentUser || !student?.id) return;
  await setDoc(
    doc(db, 'studentApprovals', student.id),
    {
      studentUid: student.id,
      studentName: student.displayName || student.email || student.id,
      studentEmail: student.email || '',
      parentUid: parentUser.uid,
      parentName: parentUser.displayName || parentUser.email || '',
      parentEmail: parentUser.email || '',
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getStudentApproval(uid) {
  if (!db || !uid) return null;
  const snapshot = await getDoc(doc(db, 'studentApprovals', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
