import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Application CRUD operations
export const submitApplication = async (applicationData) => {
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...applicationData,
      createdAt: serverTimestamp(),
      status: 'pending',
      reviewed: false
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getApplications = async (type = null) => {
  try {
    let q;
    if (type) {
      q = query(collection(db, 'applications'), where('type', '==', type), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, applications };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const subscribeToApplications = (type, callback) => {
  let q;
  if (type) {
    q = query(collection(db, 'applications'), where('type', '==', type), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
  }
  
  return onSnapshot(q, (snapshot) => {
    const applications = [];
    snapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    callback(applications);
  });
};

export const updateApplication = async (id, data) => {
  try {
    const docRef = doc(db, 'applications', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteApplication = async (id) => {
  try {
    await deleteDoc(doc(db, 'applications', id));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// File upload functions
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteFile = async (filePath) => {
  try {
    const desertRef = ref(storage, filePath);
    await deleteObject(desertRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Notification functions
export const createNotification = async (notificationData) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      createdAt: serverTimestamp(),
      read: false
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUnreadNotifications = async () => {
  try {
    const q = query(collection(db, 'notifications'), where('read', '==', false), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notifications = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { read: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Statistics functions
export const getApplicationStats = async () => {
  try {
    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      byType: {}
    };
    
    const querySnapshot = await getDocs(collection(db, 'applications'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stats.total++;
      stats[data.status] = (stats[data.status] || 0) + 1;
      stats.byType[data.type] = (stats.byType[data.type] || 0) + 1;
    });
    
    return { success: true, stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  auth,
  db,
  storage,
  signIn,
  logOut,
  onAuthChange,
  submitApplication,
  getApplications,
  subscribeToApplications,
  updateApplication,
  deleteApplication,
  uploadFile,
  deleteFile,
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
  getApplicationStats
};