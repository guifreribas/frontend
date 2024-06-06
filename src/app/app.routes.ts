import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { FullCalendarComponent } from './pages/full-calendar/full-calendar.component';
import { GraficsComponent } from './pages/grafics/grafics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapaComponent },
  { path: 'full-calendar', component: FullCalendarComponent },
  { path: 'graphics', component: GraficsComponent },
  { path: '**', redirectTo: '' },
];
