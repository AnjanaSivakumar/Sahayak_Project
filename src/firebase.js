import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "your-api-key",
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
