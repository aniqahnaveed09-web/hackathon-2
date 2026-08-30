import { signup } from "../firebase/firebase-auth.js";
const signUpForm = document.getElementById("signupForm");



const handleSignup = (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
   signup(email, password).then(function() {
       window.location.href = "../../index.html";
   });

}

signUpForm.addEventListener("submit", handleSignup)



