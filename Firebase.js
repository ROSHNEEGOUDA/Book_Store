import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCVpxoFDCcpjE0WvoEQCJDjiu_Ahl7O0gY",
  authDomain: "books-f7f55.firebaseapp.com",
  databaseURL: "https://books-f7f55-default-rtdb.firebaseio.com",
  projectId: "books-f7f55",
  storageBucket: "books-f7f55.appspot.com",
  messagingSenderId: "225747871825",
  appId: "1:225747871825:web:db215ecd5276baf3557070",
  measurementId: "G-Q436GHHC39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, storage };
