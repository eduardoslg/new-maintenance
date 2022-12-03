import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDtEk6m1GyuAF5vN1o7fjay9LFMbh7ZE_E',
  authDomain: 'cursoreact-be09b.firebaseapp.com',
  projectId: 'cursoreact-be09b',
  storageBucket: 'cursoreact-be09b.appspot.com',
  messagingSenderId: '338473374707',
  appId: '1:338473374707:web:6bb3c89d438125a8883886',
  measurementId: 'G-SQZ3EBG6CK',
}

if (!firebase.getApps.length) {
  firebase.initializeApp(firebaseConfig)
}
export default firebase
