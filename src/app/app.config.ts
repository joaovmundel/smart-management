import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { AUTH_CONFIG } from '@smart-management/auth';
import { environment } from '../environments/environment';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    { provide: AUTH_CONFIG, useValue: { apiUrl: environment.API_URL } }, provideAnimationsAsync(),
  ],
};
