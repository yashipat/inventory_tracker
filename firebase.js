// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIjDVC-O3X8oaWNQ4rh87-fgEALlWdNaI",
  authDomain: "inventorytracker-8a641.firebaseapp.com",
  projectId: "inventorytracker-8a641",
  storageBucket: "inventorytracker-8a641.appspot.com",
  messagingSenderId: "677059888750",
  appId: "1:677059888750:web:045776d1c2b2e7898bc87f",
  measurementId: "G-T1P5V8Z8WC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore};