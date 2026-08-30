import { login } from "../firebase/firebase-auth.js";


const Loginform = document.getElementById("loginForm")



const handleLogin = (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
   login(email, password).then(function() {
       window.location.href = "../../index.html";
   });

}

Loginform.addEventListener("submit", handleLogin);


