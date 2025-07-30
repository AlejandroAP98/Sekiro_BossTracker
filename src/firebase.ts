// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyD9GG_naBoixiJvOBb5nWBNp778x0UYmUI",
  authDomain: "sekirobosstracker.firebaseapp.com",
  databaseURL: "https://sekirobosstracker-default-rtdb.firebaseio.com",
  projectId: "sekirobosstracker",
  storageBucket: "sekirobosstracker.firebasestorage.app",
  messagingSenderId: "660518523471",
  appId: "1:660518523471:web:cbc5643cb2670ccaf7103a"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
