import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  },
    {
    path: 'splash-screen',
    loadComponent: () => import('./splash-screen/splash-screen.page').then( m => m.SplashScreenPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'main',
    loadComponent: () => import('./main/main.page').then(m=> m.MainPage),
  },
  {
    path: 'cosas-feas',
    loadComponent: () => import('./cosas-feas/cosas-feas.page').then(m => m.CosasFeasPage)
  },
  {
    path: 'cosas-lindas',
    loadComponent: () => import('./cosas-lindas/cosas-lindas.page').then(m => m.CosasLindasPage)
  },
    {
    path: 'mi-galeria',
    loadComponent: () => import('./mi-galeria/mi-galeria.page').then(m => m.MiGaleriaPage)
  },
      {
    path: 'graficos-lindas',
    loadComponent: () => import('./graficos-lindas/graficos-lindas.page').then(m => m.GraficosLindasPage)
  },
  {
    path: 'graficos-feas',
    loadComponent: () => import('./graficos-feas/graficos-feas.page').then( m => m.GraficosFeasPage)
  },
];
