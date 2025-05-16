import { Component, AfterViewInit } from '@angular/core';
import Chart, { ArcElement } from 'chart.js/auto';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos-lindas.page.html',
  styleUrls: ['./graficos-lindas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GraficosLindasPage implements AfterViewInit {
  topImages: { image_url: string; vote_count: number }[] = [];

  constructor(private authService: AuthService, private spinnerService:SpinnerService) {}

async ngAfterViewInit() {
  try {
    this.spinnerService.show();

    const result = await this.authService.getTopVotedImagesLindas();
    console.log('Canvas encontrado:', document.getElementById('myPieChart'));
    console.log(result);

    this.topImages = result.map(item => ({
      image_url: item.image_url ?? item.image_url,
      vote_count: item.vote_count ?? item.vote_count,
    }));

    if (this.topImages.length) {
      this.renderPieChart();
    }

    // Espera 2 segundos para que se vea el spinner
  } finally {
    this.spinnerService.hide();
  }
}

  renderPieChart() {
    const labels = this.topImages.map((_, i) => `Imagen ${i + 1}`);
    const data = this.topImages.map(item => item.vote_count);
    const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];

    const images: HTMLImageElement[] = this.topImages.map(item => {
      const img = new Image();
      img.src = item.image_url;
      return img;
    });

  const canvas = document.getElementById('myPieChart') as HTMLCanvasElement;
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
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Cantidad de votos',
          data,
          backgroundColor: backgroundColors,
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Top imágenes',
            font: { size: 18 }
          },
          tooltip: {
            enabled: false
          }
        },
        animation: {
          onComplete: () => {
            const chart = Chart.getChart('myPieChart');
            if (!chart) return;

            const ctx = chart.ctx;
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

            const arcs = chart.getDatasetMeta(0).data as ArcElement[];

            arcs.forEach((arc, index) => {
              const angle = (arc.startAngle + arc.endAngle) / 2;
              const radius = arc.outerRadius;
              const imgRadius = radius / 2;

              const x = centerX + imgRadius * Math.cos(angle);
              const y = centerY + imgRadius * Math.sin(angle);

              const imgSize = 40;
              const img = images[index];
              if (img && img.complete) {
                ctx.drawImage(img, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize);
              }
            });
          }
        }
      }
    });
  }
}
