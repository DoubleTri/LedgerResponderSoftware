import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC65lhWKb56zt-kHcJGowfR5NuRtrMLiQM",
    authDomain: "ledger-master.firebaseapp.com",
    databaseURL: "https://ledger-master.firebaseio.com",
    projectId: "ledger-master",
    storageBucket: "gs://ledger-master.appspot.com",
    messagingSenderId: "900829502022"
};
export const app = firebase.initializeApp(config);

export const auth = firebase.auth();

export const storage = firebase.storage();

export const functions = firebase.functions();

export default { app, auth, storage };