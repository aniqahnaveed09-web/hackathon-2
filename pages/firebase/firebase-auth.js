import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);
 

const signup = (email , password) => {


return createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
   console.log("signup successful", user);
   
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("signup error", errorCode, errorMessage);
    
    // ..
  });

}

// logIn 

const login = ( email, password ) =>{
return signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
   console.log("login successful", user);

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("login error", errorCode, errorMessage);

  });

}
export {signup ,login}

