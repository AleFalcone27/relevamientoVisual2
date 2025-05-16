import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonLabel, IonItem, IonInput, IonButton, IonRow } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerService } from '../services/spinner.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonRow, IonButton, IonInput, IonItem, IonLabel, IonCol, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, ReactiveFormsModule],
})
export class HomePage {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

async onLogin() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.spinnerService.show(); // Mostrar spinner

    try {
      await this.authService.login(email, password);

      // Esperar 2 segundos antes de navegar
   

      this.router.navigate(['/main']); // Luego navegar
    } catch (err: any) {
      this.showLoginError(err);
    } finally {
      this.spinnerService.hide(); // Ocultar spinner al final
    }
  }
}


  async showLoginError(error: any) {
    let mensaje = 'Ha ocurrido un error al iniciar sesión.';
    console.log(error.code)
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          mensaje = 'No se encontró un usuario con ese correo.';
          break;
        case 'auth/wrong-password':
          mensaje = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El correo electrónico no es válido.';
          break;
        case 'auth/invalid-credential':
          mensaje = 'Correo o contraseña incorrectos.';
          break;
        default:
          mensaje = 'Error: ' + error.message;
      }
    }

    const alert = await this.alertController.create({
      header: 'Error de Inicio de Sesión',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  fillTestUser1() {
    this.loginForm.setValue({
      email: 'test1@example.com',
      password: 'password123'
    });
  }

  fillTestUser2() {

    this.loginForm.setValue({
      email: 'test2@example.com',
      password: 'password456'
    });
  }
}
