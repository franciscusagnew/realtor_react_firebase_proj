// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC7WI4JnfrTW-al4CqcaFJPYPVRzapmLE0",
	authDomain: "realtor-clone-51798.firebaseapp.com",
	projectId: "realtor-clone-51798",
	storageBucket: "realtor-clone-51798.firebasestorage.app",
	messagingSenderId: "983794738301",
	appId: "1:983794738301:web:275a8f7f31248fae7b7d14",
	measurementId: "G-196Z82P79B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
