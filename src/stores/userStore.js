// stores/userStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {  collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../firebase/firebase.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const useUserStore = defineStore('userStore', () => {
  const userID = ref(null);
  const router = useRouter();
  
  function setUserID(id) {
    console.log('setting user ID')
    userID.value = id;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function validateUser(email) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email)); // Adjust "email" if your field has a different name
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // User exists
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        //userID.value = userData.id; // Replace with correct field if different
  
        setUserID(userData.id); // Adjust for how you set the user ID
        return true;
      } else {
        // User does not exist
        console.log("No such user!");
        return false;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return false;
    }
  }

  async function handleLogin(email, password) {
    if (email && password && isValidEmail(email)) {
      try {
        if (validateUser(email)){
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const userID = userCredential.user.uid;
          console.log(`Logged in as: ${userID}`)
          router.push('/home')
        } else {
          log = false;
        }
        
      } catch (error) {
        console.error("Error logging in:", error.message)
        
      }
    } else {
      console.log("Please enter valid credentials.")
    }
  }

  async function handleRegister(username, email, password) {
    const date = Date.now().toString()
    const userType = regType.value ? regType.value.toString() : 'User'; // Fallback to 'defaultType'
    const userID = userType + date;
    
    setUserID(userID);
    
    console.log('userID:', userID)
  
    if (email && password && username) {
      try {

        // Check if email already exists in Firestore
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('email', '==', email));
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
          console.log("Email is already registered.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        await sendEmailVerification(user);
        console.log("Verification email sent. Please check your inbox to verify your email.");

        // Store user information in Firestore
        await setDoc(doc(db, 'users', userID), {
          username: username,
          email: email,
          robots: [],
          createdAt: new Date()
        })
  
        console.log(`User registered with UID: ${userID}`)
        router.push('/home')
      } catch (error) {
        console.error("Error registering:", error.message)
      }
    } else {
      console.log("Please fill out all required fields.")
    }
  }


  console.log('set ID:', userID.value)

  return { 
    userID,
    setUserID,
    validateUser,
    handleLogin,
    handleRegister
   };
});
