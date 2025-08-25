import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { AUTH_CONFIG } from '@smart-management/auth';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

registerLocaleData(localePt);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    { provide: AUTH_CONFIG, useValue: { apiUrl: environment.API_URL } },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideAnimationsAsync(),
  ],
};
