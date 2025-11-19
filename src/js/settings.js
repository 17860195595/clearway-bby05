import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
  
  
const form = document.getElementById("myForm");

form.addEventListener("submit", async (eventVariable) =>{
    eventVariable.preventDefault();

    const name = form.name.value;
    const lastname = form.lastname.value;
    const username = form.username.value;

    try {//await makes it async
        await addDoc(collection(db, "userz"), {
            name: name,
            lastname: lastname,
            username: username,
            createdAt: new Date()
        });
        alert("8saved to firestore8")
        form.reset();
    
    }   catch (err) {
        console.error(err);
        alert("8error saving creds to firestore8")
    }

    
});

// Elements where i show data
const nameEl = document.querySelector('.show-cred-container p:nth-of-type(1)');
const lastnameEl = document.querySelector('.show-cred-container p:nth-of-type(2)');
const usernameEl = document.querySelector('.show-cred-container p:nth-of-type(3)');

async function displayUserInfo() {
    try {
        const querySnapshot = await getDocs(collection(db, "userz"));
        
        // latest user
        let lastUser = null;
        querySnapshot.forEach((doc) => {
            lastUser = doc.data(); // overwrite u
        });

        if (lastUser) {
            nameEl.textContent = lastUser.name;
            lastnameEl.textContent = lastUser.lastname;
            usernameEl.textContent = lastUser.username;
        } else {
            nameEl.textContent = "No user found";
            lastnameEl.textContent = "-";
            usernameEl.textContent = "-";
        }

    } catch (err) {
        console.error("Error getting user info:", err);
    }
}

//call function at the end
displayUserInfo();