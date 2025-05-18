import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart, { BarElement, ChartTypeRegistry } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../services/spinner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graficos-feas',
  templateUrl: './graficos-feas.page.html',
  styleUrls: ['./graficos-feas.page.scss'],
  standalone: true,
  imports: [IonButtons, IonBackButton, IonSpinner, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GraficosFeasPage implements OnInit, AfterViewInit {
  topImages: { image_url: string; vote_count: number }[] = [];
 isLoading: boolean;

  constructor(private authService: AuthService, private spinnerService: SpinnerService, private router: Router) { this.isLoading = false }

  async ngAfterViewInit() {
    try {

      this.isLoading = true
      const result = await this.authService.getTopVotedImagesFeas();
      this.topImages = result.map(item => ({
        image_url: item.image_url ?? item.image_url,
        vote_count: item.vote_count ?? item.vote_count,
      }));

      if (this.topImages.length) {
        this.renderBarChart();
      }

    } finally {
      this.spinnerService.hide();
      this.isLoading = false;
    }
  }


  ngOnInit() { }

  renderBarChart() {
    const labels = this.topImages.map((_, i) => `Imagen ${i + 1}`);
    const data = this.topImages.map(item => item.vote_count);
    const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    const images: HTMLImageElement[] = this.topImages.map(item => {
      const img = new Image();
      img.src = item.image_url;
      return img;
    });

    const canvas = document.getElementById('myBarChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Cantidad de votos',
          data,
          backgroundColor: backgroundColors,
        }]
      },
      options: {
        animation: {
          onComplete: () => {
            const chart = Chart.getChart('myBarChart');
            if (!chart) return;

            const meta = chart.getDatasetMeta(0);
            const ctx = chart.ctx;

            meta.data.forEach((bar: any, index: number) => {
              const x = bar.x;
              const y = bar.y;
              const width = bar.width ?? bar._view?.width ?? 40; // fallback por compatibilidad
              const imgSize = 30;

              const img = images[index];
              if (img && img.complete) {
                ctx.drawImage(img, x - imgSize / 2, y - imgSize - 10, imgSize, imgSize);
              }
            });
          }
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
          title: {
            display: true,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

    navBack(){
    this.router.navigate(['/cosas-feas']);
  }

}
