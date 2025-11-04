import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  apiUrl: string;
}

// Re-export to avoid circular dependencies with app config
export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
