import firebase from "firebase/app";
import firestore from "firebase/firestore";

var config = {
  apiKey: "AIzaSyDHsh_00SoyrHlx1zZMlizNiT5_jgTZrt8",
  authDomain: "vue-chat-be476.firebaseapp.com",
  databaseURL: "https://vue-chat-be476.firebaseio.com",
  projectId: "vue-chat-be476",
  storageBucket: "vue-chat-be476.appspot.com",
  messagingSenderId: "487230489996"
};
const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();
