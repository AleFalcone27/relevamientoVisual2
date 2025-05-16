import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { getAuth, provideAuth } from '@angular/fire/auth';


import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';



bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({ projectId: "ppss-83268", appId: "1:683059860359:web:9c73ac7b39b14741bb3922", storageBucket: "ppss-83268.firebasestorage.app", apiKey: "AIzaSyDYaHMI3EcUUit-xmM0guZzr4sUSqQiWjE", authDomain: "ppss-83268.firebaseapp.com", messagingSenderId: "683059860359" })), provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
});
