import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const  firebaseConfig = {
  apiKey: "AIzaSyCt-gKnHc7lwgq7i96KW1Yr1txxUPiz4pQ",
  authDomain: "sms-services-5284f.firebaseapp.com",
  projectId: "sms-services-5284f",
  storageBucket: "sms-services-5284f.appspot.com",
  messagingSenderId: "587437758412",
  appId: "1:587437758412:web:6a74402cec9350ed3c2f69",
  measurementId: "G-JDGGGDNJ5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
 const db = getFirestore(app);
export {auth,app,db}