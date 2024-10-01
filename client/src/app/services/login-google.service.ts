import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginGoogleService {
   firebaseConfig:any = {
    apiKey: "AIzaSyAPAv7YizucOEKK3_pA1cVRvvkIrxvUhfs",
    authDomain: "mindful-syntax-106206.firebaseapp.com",
    projectId: "mindful-syntax-106206",
    storageBucket: "mindful-syntax-106206.appspot.com",
    messagingSenderId: "22830837230",
    appId: "1:22830837230:web:ff22790792a8001b20b2ff",
    measurementId: "G-MC8JBL1BGB"
  };
  constructor() { }
}
