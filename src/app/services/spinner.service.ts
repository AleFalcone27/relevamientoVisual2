// spinner.service.ts
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loadingElement: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) {}

  async show() {
    this.loadingElement = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent', // Usa un spinner incorporado como fallback
      cssClass: 'custom-spinner-class',
      backdropDismiss: false,
      translucent: true,
    });

    this.loadingElement = await this.loadingCtrl.create({
  message: `
    <div class="spinner-wrapper">
      <img src="assets/icons/icon-96.webp" class="app-logo-spinner" />
    </div>
  `,
  spinner: null, // Desactiva el spinner por defecto
  cssClass: 'custom-spinner-class',
  backdropDismiss: false,
});
  }

  async hide() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
      this.loadingElement = null;
    }
  }
}
