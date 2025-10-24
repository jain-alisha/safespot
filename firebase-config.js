// Firebase Configuration for SafeSpot Crisis Map
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDoQqq2ILQzmr9XN3s46ax9HfvEe4ycOJ0",
  authDomain: "safespot-5b376.firebaseapp.com",
  projectId: "safespot-5b376",
  storageBucket: "safespot-5b376.firebasestorage.app",
  messagingSenderId: "1047002137251",
  appId: "1:1047002137251:web:d0be00ff4d44f057543516",
  measurementId: "G-DEH9XJDKBC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

console.log('Firebase initialized successfully!');