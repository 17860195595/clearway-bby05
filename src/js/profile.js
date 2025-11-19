import { auth, db, storage } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const pfpImage = document.getElementById("pfp-image");
  const uploadInput = document.getElementById("upload-pfp");
  const resetBtn = document.getElementById("reset-pfp");

  let currentUser = null;

  // make it so user has to be logged in to change pfp
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    currentUser = user;

    // loads the pfp from firestore
    const pfpDocRef = doc(db, "pfp", user.uid);
    try {
      const pfpSnap = await getDoc(pfpDocRef);
      if (pfpSnap.exists() && pfpSnap.data().image) {
        pfpImage.src = pfpSnap.data().image;
      }
    } catch (err) {
      console.error("Error loading profile picture:", err);
    }

  });

  // listner for picking new pfp
  pfpImage.addEventListener("click", () => uploadInput.click());

  // makes file input into the actuall pfp
  uploadInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    //this makes it so it shows up instantly
    const reader = new FileReader();
    reader.onload = (e) => {
      pfpImage.src = e.target.result; // Update placeholder instantly
    };
    reader.readAsDataURL(file);

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Save download URL in Firestore
      const pfpDocRef = doc(db, "pfp", currentUser.uid);
      await setDoc(pfpDocRef, { image: downloadURL }, { merge: true });

      // Force browser to refresh image
      pfpImage.src = downloadURL + "?t=" + new Date().getTime();
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  });

  // pfp reset button
  resetBtn.addEventListener("click", async () => {
    const placeholder = "/src/assets/images/pfp-paceholder.jpg";
    pfpImage.src = placeholder;

    if (!currentUser) return;
    const pfpDocRef = doc(db, "pfp", currentUser.uid);
    await setDoc(pfpDocRef, { image: null }, { merge: true });
  });
});
