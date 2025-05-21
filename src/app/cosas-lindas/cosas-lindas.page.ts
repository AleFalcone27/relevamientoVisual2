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
import { IonHeader, IonContent, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonFabList, IonSpinner, IonButtons, IonBackButton, IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-cosas-lindas',
  templateUrl: './cosas-lindas.page.html',
  styleUrls: ['./cosas-lindas.page.scss'],
  standalone: true,
  imports: [IonFooter, IonBackButton, IonButtons, IonSpinner, IonFabList, IonIcon, IonFabButton, IonFab, IonCol, IonRow, IonGrid, IonTitle, IonToolbar, IonContent, IonHeader, CommonModule, FormsModule]
})
export class CosasLindasPage implements OnInit {
  images: string[] = [];
  lastVotedUrl: string | null = null;
  isLoading: boolean;
  votedUrls: string[] = [];
  imageInfos: { url: string; email: string; date: Date | null }[] = [];

  constructor(private router: Router, private authService: AuthService, private SpinnerService: SpinnerService, private alertCtrl: AlertController) {
    addIcons({'addOutline':addOutline,'cameraOutline':cameraOutline,'imageOutline':imageOutline,'pieChartOutline':pieChartOutline,'albumsOutline':albumsOutline,});
    this.isLoading = false;;
  }

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.images = await this.authService.getCosasLindasImages();

      this.imageInfos = this.images.map(url => {
        const info = this.extractImageInfo(url);
        return {
          url,
          email: info?.email || 'Desconocido',
          date: info ? this.parseTimestampToDate(info.timestamp) : null
        };
      });

      this.votedUrls = await this.authService.getVotedImagesByUser();

      this.imageInfos.sort((a, b) => {
        if (a.date && b.date) {
          return b.date.getTime() - a.date.getTime();
        }
        return 0;
      });

    } catch (err) {
      console.error('Error al cargar imágenes:', err);
    } finally {
      this.SpinnerService.hide();
      this.isLoading = false;
    }
  }


  async voteForImage(imageUrl: string) {
    const alert = await this.alertCtrl.create({
      header: '¿Te gusta esta imagen?',
      buttons: [
        {
          text: '👍 Me gusta',
          handler: async () => {
            this.isLoading = true;
            try {
              await this.authService.votarImagen(imageUrl);

              // Agregar la imagen votada al array si no está ya
              if (!this.votedUrls.includes(imageUrl)) {
                this.votedUrls.push(imageUrl);
              }

              this.lastVotedUrl = imageUrl;
            } catch (err) {
              console.error('Error al votar:', err);
            } finally {
              this.isLoading = false;
            }
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
      this.isLoading = true;
      try {
        const url = await this.authService.uploadCosasLindasToSupabase(image.webPath);
        console.log('URL de imagen en Supabase:', url);

        // Recargar imágenes y actualizar imageInfos
        this.images = await this.authService.getCosasLindasImages();
        this.imageInfos = this.images.map(url => {
          const info = this.extractImageInfo(url);
          return {
            url,
            email: info?.email || 'Desconocido',
            date: info ? this.parseTimestampToDate(info.timestamp) : null
          };
        });
        this.imageInfos.sort((a, b) => {
          if (a.date && b.date) {
            return b.date.getTime() - a.date.getTime();
          }
          return 0;
        });

      } finally {
        this.isLoading = false;
      }
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
      this.isLoading = true;
      try {
        const url = await this.authService.uploadCosasLindasToSupabase(image.webPath);
        console.log('URL de imagen en Supabase:', url);

        // Recargar imágenes y actualizar imageInfos
        this.images = await this.authService.getCosasLindasImages();
        this.imageInfos = this.images.map(url => {
          const info = this.extractImageInfo(url);
          return {
            url,
            email: info?.email || 'Desconocido',
            date: info ? this.parseTimestampToDate(info.timestamp) : null
          };
        });
        this.imageInfos.sort((a, b) => {
          if (a.date && b.date) {
            return b.date.getTime() - a.date.getTime();
          }
          return 0;
        });

      } finally {
        this.isLoading = false;
      }
    }
  }

  extractImageInfo(url: string): { email: string; timestamp: string } | null {
    const match = url.match(/cosasLindas\/(.+?)\.jpeg$/);
    if (match && match[1]) {
      const [email, ...timestampParts] = match[1].split('-');
      const timestamp = timestampParts.join('-');
      return { email, timestamp };
    }
    return null;
  }

  parseTimestampToDate(timestamp: string): Date | null {
    const [datePart, timePart] = timestamp.split('-'); // "20250518", "153248"

    if (!datePart || !timePart) return null;

    const year = parseInt(datePart.substring(0, 4), 10);
    const month = parseInt(datePart.substring(4, 6), 10) - 1; // JS month is 0-indexed
    const day = parseInt(datePart.substring(6, 8), 10);

    const hour = parseInt(timePart.substring(0, 2), 10);
    const minute = parseInt(timePart.substring(2, 4), 10);
    const second = parseInt(timePart.substring(4, 6), 10);

    if (
      !isNaN(year) && !isNaN(month) && !isNaN(day) &&
      !isNaN(hour) && !isNaN(minute) && !isNaN(second)
    ) {
      return new Date(year, month, day, hour, minute, second);
    }

    return null;
  }


  goToCharts() {
    this.router.navigate(['/graficos-lindas']);
  }

  goToUserGallery() {
    this.router.navigate(['/mi-galeria']);
  }

  navBack() {
    this.router.navigate(['/main']);
  }
}
