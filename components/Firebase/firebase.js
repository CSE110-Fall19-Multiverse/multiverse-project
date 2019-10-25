/**
 * Firebase Project ID: multiverse-ucsd
 * Refer to https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
 */
import app from 'firebase/app';
import 'firebase/auth';

// firebase database for development
const devFirebaseConfig = {
    apiKey: "AIzaSyBtUDC-MguCweBMzAOtlq-ZUwU5zMDl948",
    authDomain: "multiverse-ucsd.firebaseapp.com",
    databaseURL: "https://multiverse-ucsd.firebaseio.com",
    projectId: "multiverse-ucsd",
    storageBucket: "multiverse-ucsd.appspot.com",
    messagingSenderId: "1090838984834",
    appId: "1:1090838984834:web:5afcd862810294e55d5c9b",
    measurementId: "G-9G2NN8Q60W"
};

class Firebase {
    constructor() {
        app.initializeApp(devFirebaseConfig);

        this.auth = app.auth();
    }

    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
}

export default Firebase;