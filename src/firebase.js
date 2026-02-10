import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC4OUrElooDZLFpWOJB_eCfCOQbAwWlcWY",
    authDomain: "school-bus-tracking-g60.firebaseapp.com",
    databaseURL: "https://school-bus-tracking-g60-default-rtdb.firebaseio.com",
    projectId: "school-bus-tracking-g60",
    storageBucket: "school-bus-tracking-g60.firebasestorage.app",
    messagingSenderId: "863903236422",
    appId: "1:863903236422:web:70eaf572f69c1dd64de547",
    measurementId: "G-FFW7ZZB6VK"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
