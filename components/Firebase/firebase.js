/**
 * Firebase Project ID: multiverse-ucsd
 * Refer to https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
 */
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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
        this.db = app.database();
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

    // *** User API ***
    get_current_user = () => this.auth.currentUser;

    // reference to a user by uid
    user = uid => this.db.ref(`users/${uid}`);

    // reference to a post by pid
    post = (type, pid) => this.db.ref(`posts/posted/${type}/${pid}`);
    draft = (type, pid) => this.db.ref(`posts/drafted/${type}/${pid}`);

    // reference to a post dir by uid
    post_dir = (type, status, uid) => this.db.ref(`users/${uid}/history_posts/${status}/${type}`);

    // reference to all users
    users = () => this.db.ref('users');

    buying_posts = () => this.db.ref(`posts/posted/buying_posts`);

    selling_posts = () => this.db.ref(`posts/posted/selling_posts`);

    buying_post_drafts = () =>this.db.ref('posts/drafted/buying_post_drafts');
    selling_post_drafts = () =>this.db.ref('posts/drafted/selling_post_drafts');
}

export default Firebase;