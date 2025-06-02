import { Routes } from '@angular/router';
import { ClientPortalComponent } from './client-portal/client-portal.component';
import { ClientThankYouComponent } from './client-portal/client-thank-you.component';
import { LanguageSelectorComponent } from './client-portal/language-selector.component';

export const routes: Routes = [
  // Language selection screen
  { path: 'lang-select/:plate/:folderName', component: LanguageSelectorComponent },

  // Client portal with language
  { path: 'client-portal/:lang/:plate/:folderName', component: ClientPortalComponent },

  // Thank-you page
  { path: 'thank-you', component: ClientThankYouComponent },

  // Fallback
  { path: '**', redirectTo: '' },

  { path: 'client-portal/:lang/:plate/:folderName', component: ClientPortalComponent },

];
