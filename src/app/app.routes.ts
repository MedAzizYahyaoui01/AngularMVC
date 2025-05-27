import { Routes } from '@angular/router';
import { ClientPortalComponent } from './client-portal/client-portal.component';
import { ClientThankYouComponent } from './client-portal/client-thank-you.component';

export const routes: Routes = [
  { path: ':plate/:folderName', component: ClientPortalComponent },  // must be first
  { path: ':plate', component: ClientPortalComponent },
  { path: 'thank-you', component: ClientThankYouComponent },
  { path: '**', redirectTo: '' }
];
