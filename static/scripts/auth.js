  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
  import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAgV5gduUNOrCuMsbJF0E8lgnxFPCVOKbA",
    authDomain: "alz-well.firebaseapp.com",
    projectId: "alz-well",
    storageBucket: "alz-well.appspot.com",
    messagingSenderId: "825565193165",
    appId: "1:825565193165:web:567805b2757d748234da84",
    measurementId: "G-CLZ37NFJSE"
  };


  function showMsg(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
      messageDiv.style.opacity=0;
    },5000);
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
// Initialize Firebase

const signUp = document.getElementById('submitSignUp');

signUp.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission

    // Retrieve input values
    const email = document.getElementById('email_id').value.trim();
    const password = document.getElementById('pass').value.trim();
    const name = document.getElementById('username').value.trim();

    // Log input values to the console for debugging
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Name:", name);

    // Check if all fields are filled
    if (!email || !password || !name) {
        showMsg('Please fill in all fields!', 'msgUpCont');
        return;
    }

    const auth = getAuth();
    const db = getFirestore();

    // Create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                name: name
            };

            // Save user data to Firestore
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    showMsg('Account Created Successfully...', 'msgUpCont');
                    window.location.href = '../signup.html'; // Make sure this redirection is intended.
                })
                .catch((error) => {
                    console.error("Error writing document:", error);
                    showMsg('Error saving user data. Try again!', 'msgUpCont');
                });
        })
        .catch((error) => {
            console.error("Error during sign-up:", error);
            showMsg(`Invalid Mail : ${error.message}`, 'msgUpCont'); // Display full error message
        });
});


// Select the sign-in button and message div
const signInButton = document.getElementById('submitSignIn');
const signInMessage = document.getElementById('signInMessage');

signInButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form behavior

    // Get input values for email and password
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if inputs are filled
    if (!email || !password) {
        showMessage('Please fill in all fields!', 'signInMessage');
        return;
    }

    const auth = getAuth();

    // Attempt to sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage'); // Display success message
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid); // Store user ID in local storage
            window.location.href = '../home.html'; // Redirect to homepage
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                showMessage('Incorrect Email or Password', 'signInMessage'); // Handle incorrect credentials
            } else {
                showMessage('Account does not exist', 'signInMessage'); // Handle other errors
            }
        });
});

// Function to display messages in the specified div
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerText = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        messageDiv.style.display = 'none';
    }, 5000);
}
