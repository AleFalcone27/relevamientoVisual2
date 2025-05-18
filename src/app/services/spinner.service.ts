import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loadingElement: HTMLIonLoadingElement | null = null;
  private isLoading = false;

  constructor(private loadingCtrl: LoadingController) {}

  async show(message: string = '', spinnerType: 'crescent' | 'bubbles' | 'circles' | 'dots' | 'lines' | null = 'crescent') {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.loadingElement = await this.loadingCtrl.create({
      spinner: 'dots',
      cssClass: 'custom-spinner-class',
      backdropDismiss: false,
      translucent: true,
    });

    await this.loadingElement.present();
  }

  async hide() {
    if (this.isLoading && this.loadingElement) {
      try {
        await this.loadingElement.dismiss();
      } catch (error) {
        console.error('Error al ocultar el spinner:', error);
      } finally {
        this.loadingElement = null;
        this.isLoading = false;
      }
    }
  }
}
