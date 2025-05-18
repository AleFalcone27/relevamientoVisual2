import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private router: Router) {
    this.initializeApp();
  }
  async initializeApp() {

    await SplashScreen.hide();

    setTimeout(() => {
      this.router.navigate(['/home'])
    }, 3000)
  }
}
