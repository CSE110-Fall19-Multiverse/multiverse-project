/**
 * Firebase Project ID: multiverse-ucsd
 * Refer to https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
 */
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/functions';

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
        this.storage = app.storage();
        this.cloud = app.firestore();
        this.functions = app.functions();
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

    // reference to avatar
    avatar = uid => this.storage.ref(`avatar/${uid}`);

    // reference to a comment by uid
    comment = cid => this.db.ref(`comments/${cid}`);

    // reference to a post by pid
    post  = (isBuying, pid) => {
        const type = isBuying ? 'buying_posts' : 'selling_posts';
        return this.db.ref(`posts/posted/${type}/${pid}`)
    };

    draft = (isBuying, pid) => {
        const type = isBuying ? 'buying_post_drafts' : 'selling_post_drafts';
        return this.db.ref(`posts/drafted/${type}/${pid}`);
    };

    // reference all comments
    comments = () =>this.db.ref('comments');

    // reference a post's comments
    comments_dir = (type, pid) =>this.db.ref(`posts/posted/${type}/${pid}/comments`);

    // reference to a history post dir by uid
    history_post_dir = (type, status, uid) => this.db.ref(`users/${uid}/history_posts/${status}/${type}`);

    // reference to a liked post dir by uid
    liked_post_dir = (type, uid) => this.db.ref(`users/${uid}/liked_posts/${type}`);

    // reference to all users
    users = () => this.db.ref('users');

    buying_posts = () => this.db.ref(`posts/posted/buying_posts`);

    selling_posts = () => this.db.ref(`posts/posted/selling_posts`);

    posted = () => this.db.ref(`posts/posted/`);

    buying_post_drafts = () =>this.db.ref('posts/drafted/buying_post_drafts');
    selling_post_drafts = () =>this.db.ref('posts/drafted/selling_post_drafts');

    get_user_by_id = uid =>this.db.ref(`users/${uid}`);
    get_post_by_id = uid =>this.db.ref(`posts/buying_posts/${uid}`);

    //firestore
    get_posts = () => this.cloud.collection('posts');


}

export default Firebase;