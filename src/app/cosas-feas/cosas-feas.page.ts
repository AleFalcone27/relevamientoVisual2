import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, cameraOutline, imageOutline, trashOutline, pieChartOutline, albumsOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';

import { AlertController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonFabList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.page.html',
  styleUrls: ['./cosas-feas.page.scss'],
  standalone: true,
  imports: [IonFabList, IonIcon, IonFabButton, IonFab, IonCol, IonRow, IonGrid, IonContent, IonTitle, IonToolbar, IonHeader,  CommonModule, FormsModule]
})
export class CosasFeasPage implements OnInit {
  images: string[] = [];
  lastVotedUrl: string | null = null;

  constructor(private router: Router, private authService: AuthService, private SpinnerService: SpinnerService, private alertCtrl: AlertController) {
    addIcons({ 'addOutline': addOutline, 'cameraOutline': cameraOutline, 'imageOutline': imageOutline, 'pieChartOutline': pieChartOutline, 'albumsOutline': albumsOutline, });
  }

  async ngOnInit() {
    try {
      this.SpinnerService.show()
      this.images = await this.authService.getCosasFeasImages();
      const lastVote = await this.authService.getLastVotedImage();
      this.lastVotedUrl = lastVote?.imageUrl ?? null;
      console.log(this.images)
    } catch (err) {
      console.error('Error al cargar imágenes:', err);
    }
    finally{
      this.SpinnerService.hide()
    }
  }

  async voteForImage(imageUrl: string) {
    const alert = await this.alertCtrl.create({
      header: '¿Te gusta esta imagen?',
      buttons: [
        {
          text: '👍 Me gusta',
          handler: async () => {
            await this.authService.votarImagen(imageUrl);
            this.lastVotedUrl = imageUrl;
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }


  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    if (image.webPath) {
      this.SpinnerService.show()
      const url = await this.authService.uploadCosasFeasToSupabase(image.webPath);
      console.log('URL de imagen en Supabase:', url);
      this.images = await this.authService.getCosasFeasImages();
      this.SpinnerService.hide()
    }
  }

  async openGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    if (image.webPath) {
      this.SpinnerService.show()
      const url = await this.authService.uploadCosasFeasToSupabase(image.webPath);
      console.log('URL de imagen en Supabase:', url);
      this.images = await this.authService.getCosasFeasImages();
      this.SpinnerService.hide()
    }
  }

  goToCharts() {
    // Acá podrías navegar a la página de gráficos
    this.router.navigate(['/graficos-feas']);
  }

  goToUserGallery() {
    // Acá podrías navegar a la galería de imágenes del usuario
    this.router.navigate(['/mi-galeria']);
  }


}
