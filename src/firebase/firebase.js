// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAtmW5fBZgVW8znkB46J-wUT5o2-28N0PE',
  authDomain: 'iautomate-firestore.firebaseapp.com',
  projectId: 'iautomate-firestore',
  storageBucket: 'iautomate-firestore.appspot.com',
  messagingSenderId: '192202152264',
  appId: '1:192202152264:web:b6b06aa70a62d715cffb7d'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const db = getFirestore(app);

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
export{ 
  db,
  auth,
  logout
 };