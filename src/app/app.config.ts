import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection, InjectionToken } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { API_CONFIG, jwtInterceptor } from '@smart-management/shared';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

// Auth config token for lazy loaded auth module
export interface AuthConfig {
  apiUrl: string;
}
export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

registerLocaleData(localePt);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions()
    ),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: AUTH_CONFIG, useValue: { apiUrl: environment.API_URL } },
    { provide: API_CONFIG, useValue: { apiUrl: environment.API_URL } },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideAnimationsAsync(),
  ],
};
