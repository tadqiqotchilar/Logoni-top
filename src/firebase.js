import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXXFzy1dzqHth2vGBaOwGGWEqG5TKyVFU",
  authDomain: "logoni-top.firebaseapp.com",
  projectId: "logoni-top",
  storageBucket: "logoni-top.firebasestorage.app",
  messagingSenderId: "225575135774",
  appId: "1:225575135774:web:8bed59d96ad26fa0711c0f",
  measurementId: "G-5S5TED9TGC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
