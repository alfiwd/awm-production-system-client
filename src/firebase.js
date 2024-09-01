import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCvLemY2POxKkDBxp53DhD270jMKJToaF0',
  authDomain: 'awm-production-system.firebaseapp.com',
  projectId: 'awm-production-system',
  storageBucket: 'awm-production-system.appspot.com',
  messagingSenderId: '365554562758',
  appId: '1:365554562758:web:a83e1be6ac6561be8589c7'
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
