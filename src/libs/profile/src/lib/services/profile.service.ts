import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '@smart-management/shared';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  /**
   * Get current user profile
   * TODO: Replace with actual API call
   */
  getUserProfile(): Observable<User> {
    // Mock user data - replace with actual API call
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '+5511999999999',
      photo: undefined, // Will use default avatar
      company: {
        id: '1',
        name: 'Empresa Exemplo Ltda',
        description: 'Empresa de tecnologia especializada em soluções inovadoras',
        createdAt: new Date(),
      },
      createdAt: new Date(),
    };

    return of(mockUser).pipe(delay(500)); // Simulate API delay
  }

  /**
   * Update user profile
   * TODO: Replace with actual API call
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    // Mock update - replace with actual API call
    const updatedUser: User = {
      id: '1',
      name: userData.name || 'João Silva',
      email: userData.email || 'joao.silva@example.com',
      phone: userData.phone || '+5511999999999',
      photo: userData.photo || undefined,
      company: {
        id: '1',
        name: 'Empresa Exemplo Ltda',
        description: 'Empresa de tecnologia especializada em soluções inovadoras',
        createdAt: new Date(),
      },
      createdAt: new Date(),
    };

    return of(updatedUser).pipe(delay(1000)); // Simulate API delay
  }
}