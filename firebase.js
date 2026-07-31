// =========================================
// FIREBASE
// =========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBP_fgYUSZVGP7gIhs1YvQZtcoAFM3dv40",
    authDomain: "housekeeping-toex.firebaseapp.com",
    projectId: "housekeeping-toex",
    storageBucket: "housekeeping-toex.firebasestorage.app",
    messagingSenderId: "316865958801",
    appId: "1:316865958801:web:6be936a5a262981bb34030"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };