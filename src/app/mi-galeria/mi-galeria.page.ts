import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-galeria',
  templateUrl: './mi-galeria.page.html',
  styleUrls: ['./mi-galeria.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MiGaleriaPage implements OnInit {

  images: any[] = [];
  isLoading: boolean;

  constructor(private authService: AuthService, private spinnerService: SpinnerService, private location: Location, private router: Router) { this.isLoading = false;}

  async ngOnInit() {
    try {
    this.isLoading = true;
      this.images = await this.authService.getAllImages();
      console.log("Imágenes cargadas:", this.images);
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
    } finally {
    this.isLoading = false;
    }
  }

    navBack(){
    this.location.back();
  }


}
