import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7RTrsBpzEhIl69PL0cYhFnDQCORnKkw8",
  authDomain: "assignment-ii-76d53.firebaseapp.com",
  projectId: "assignment-ii-76d53",
  storageBucket: "assignment-ii-76d53.appspot.com",
  messagingSenderId: "870830066978",
  appId: "1:870830066978:web:dc154c8a37945b74a0a97b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log(user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText =
            userData.firstName;
          document.getElementById("loggedUserEmail").innerText = userData.email;
          document.getElementById("loggedUserLName").innerText =
            userData.lastName;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting document");
      });
  } else {
    console.log("User Id not Found in Local storage");
  }
});

/* const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
}); */

let slides = document.querySelectorAll(".slide");

async function fetchRandomArt() {
  try {
    // Fetch a list of all objects to get the total number of objects
    const objectListUrl =
      "https://collectionapi.metmuseum.org/public/collection/v1/objects";
    const response = await fetch(objectListUrl);
    const data = await response.json();

    let objectId;
    let objectData;

    // Loop to ensure we get an object with an image
    do {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * data.total);
      objectId = data.objectIDs[randomIndex];

      // Fetch details for a random object
      const objectDetailsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
      const objectResponse = await fetch(objectDetailsUrl);
      objectData = await objectResponse.json();
    } while (!objectData.primaryImage);

    // Update HTML with the fetched data
    document.getElementById("title").textContent =
      objectData.title || "No title available";
    document.getElementById("description").textContent =
      objectData.objectName || "No description available";
    document.getElementById("primaryImage").src = objectData.primaryImage || "";
    document.getElementById("primaryImage").alt =
      "Image of " + (objectData.title || "artwork");

    // Display artist information if available
    if (objectData.constituents && objectData.constituents.length > 0) {
      const artist = objectData.constituents[0];
      document.getElementById("artistName").textContent =
        artist.name || "Unknown Artist";
      document.getElementById("artistRole").textContent =
        artist.role || "No role available";
      document.getElementById("artistBio").textContent =
        artist.constituentULAN_URL || "No additional bio available";
    } else {
      document.getElementById("artistName").textContent =
        "Artist information not available";
      document.getElementById("artistRole").textContent = "";
      document.getElementById("artistBio").textContent = "";
    }
  } catch (error) {
    console.error("Failed to fetch artwork:", error);
  }
}

// Add event listener to the button
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("fetchArtButton")
    .addEventListener("click", fetchRandomArt);
  startSlideshow();
});

async function startSlideshow() {
  try {
    // Fetch a list of all objects to get the total number of objects
    const objectListUrl =
      "https://collectionapi.metmuseum.org/public/collection/v1/objects";
    const response = await fetch(objectListUrl);
    const data = await response.json();

    // Preload images
    let images = [];
    for (let i = 0; i < 5; i++) {
      let objectId;
      let objectData;
      do {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * data.total);
        objectId = data.objectIDs[randomIndex];

        // Fetch details for a random object
        const objectDetailsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
        const objectResponse = await fetch(objectDetailsUrl);
        objectData = await objectResponse.json();
      } while (!objectData.primaryImage);

      images.push(objectData.primaryImage);
    }

    // Update slides with images
    slides.forEach((slide, index) => {
      slide.style.backgroundImage = `url(${images[index]})`;
    });
  } catch (error) {
    console.error("Failed to fetch slideshow images:", error);
  }
}
