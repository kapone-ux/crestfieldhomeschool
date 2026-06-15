// Firebase Configuration for Crestfield Online Homeschool
// Replace these values with your actual Firebase project credentials

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "crestfield-academy.firebaseapp.com",
  projectId: "crestfield-academy",
  storageBucket: "crestfield-academy.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID_HERE",
  measurementId: "G-XXXXXXXXXX"
};

// Firebase initialization
export const initializeFirebase = () => {
  if (typeof window !== 'undefined') {
    const firebase = require('firebase/app');
    const auth = require('firebase/auth');
    const firestore = require('firebase/firestore');
    const storage = require('firebase/storage');
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    return {
      auth: firebase.auth(),
      firestore: firebase.firestore(),
      storage: firebase.storage()
    };
  }
  return null;
};

module.exports = { firebaseConfig, initializeFirebase };
