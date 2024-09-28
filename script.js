// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTTXMW5IwAQJqNcaXEokjbbmgjcdJOPU8",
    authDomain: "webcam-ef51e.firebaseapp.com",
    databaseURL: "https://webcam-ef51e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "webcam-ef51e",
    storageBucket: "webcam-ef51e.appspot.com",
    messagingSenderId: "520807420274",
    appId: "1:520807420274:web:87dac393826d5a379a0deb"
};

// Initialize Firebase and the database instance
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // This is the part where you initialize `database`

// Firebase initialization and database code (same as before)

const cameraImage = document.getElementById("cameraImage");
const lockButton = document.getElementById("lockButton");

// Fetch camera image every 500ms
// Fetch camera image from Firebase and decode Base64
const photoRef = ref(database, 'esp32/photo');
onValue(photoRef, (snapshot) => {
    const base64String = snapshot.val();
    if (base64String) {
        // Create a data URL from the Base64 string and set it as the image source
        cameraImage.src = `data:image/jpeg;base64,${base64String}`;
    }
});

// Monitor the lock state
const relayRef = ref(database, 'Sensor/Relay_1');
onValue(relayRef, (snapshot) => {
    const lockState = snapshot.val();
    if (lockState === 1) {
        lockButton.classList.add('locked');
        lockButton.classList.remove('unlocked');
    } else {
        lockButton.classList.add('unlocked');
        lockButton.classList.remove('locked');
    }
});

const sound_ref = ref(database, 'Sensor/sound');
onValue(sound_ref, (snapshot) => {
    const sound_alarm = snapshot.val();
    if (sound_alarm === 1) {
        Notification.requestPermission().then(perm => {
            if (perm === "granted") {
                new Notification("Smart Door",
                {
                    body: "Terdeteksi suara di atas 70 Hz",
                    icon: "asset/smart door.ico",
                    tag: "sound_detect"
                })
            }
        })
    }
});

// Button click handler to toggle lock state
lockButton.addEventListener('click', () => {
    const isLocked = lockButton.classList.contains('locked');
    const newState = isLocked ? 0 : 1;

    // Update Firebase with new lock state
    set(ref(database, 'Sensor/Relay_1'), newState)
        .catch(error => console.error("Error updating lock state:", error));
    set(ref(database, 'Sensor/web'), newState)
        .catch(error => console.error("Error updating web state:", error));
});

