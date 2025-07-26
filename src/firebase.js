import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyAMrVcsxCAZam1O9TgIvJAJyEaG5AZm9T4",
  authDomain: "sahayak-test.firebaseapp.com",
  projectId: "sahayak-test",
  storageBucket: "sahayak-test.firebasestorage.app",
  messagingSenderId: "415252336862",
  appId: "1:415252336862:web:5df207daa277bcbb4f324f",
  measurementId: "G-V4Q17EDR0B"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
export default db;