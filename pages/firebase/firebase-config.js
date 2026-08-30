
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCGU_YadEWDp2X6f8MAI8YKEJ3HN6WfK6g",
    authDomain: "blog-website-c5e7d.firebaseapp.com",
    projectId: "blog-website-c5e7d",
    storageBucket: "blog-website-c5e7d.firebasestorage.app",
    messagingSenderId: "28485468836",
    appId: "1:28485468836:web:db930aa8859a60546fdc31",
    measurementId: "G-M3QZEXP10K"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
