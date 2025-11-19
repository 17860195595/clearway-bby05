import { db } from "./firebaseConfig.js";
import { onAuthReady } from "../js/authentication.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
// Initialize Firebase
onAuthReady((user) => {
  if (!user) {
    alert("You must be logged in to submit a report.");
    return;
  }

  // Handle form submission
  document
    .getElementById("reportForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      // Collect input values
      const username = user.displayName || user.email || user.uid;
      const type = document.getElementById("type").value;
      const comment = document.getElementById("comment").value;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Add document to Firestore
          await addDoc(collection(db, "trafficReports"), {
            username,
            type,
            comment,
            lat,
            lng,
            createAt: serverTimestamp(),
          });

          alert("Report sent successfully!");
          e.target.reset();
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Failed to send report.");
        }
      });
    });
});
