import { Routes } from '@angular/router';
import { ClientPortalComponent } from './client-portal/client-portal.component';
import { ClientThankYouComponent } from './client-portal/client-thank-you.component';

export const routes: Routes = [
  { path: ':plate', component: ClientPortalComponent },
  { path: '**', redirectTo: '' },
  { path: 'thank-you', component: ClientThankYouComponent }
];
