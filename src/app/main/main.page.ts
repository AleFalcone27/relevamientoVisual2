import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOut } from 'ionicons/icons';
import { SpinnerService } from '../services/spinner.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MainPage implements OnInit {

  constructor(private router: Router,public authService: AuthService, private spinnerService:SpinnerService ) {
     addIcons({
          'log-out': logOut,
        });
  }

  async ngOnInit(): Promise<void> {
    await this.spinnerService.hide();
  }

  goToFeas() {
    this.router.navigate(['/cosas-feas']);
  }

  goToLindas() {
    this.router.navigate(['/cosas-lindas']);
  }

}
