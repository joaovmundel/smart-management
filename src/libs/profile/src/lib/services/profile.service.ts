import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, UserService } from '@smart-management/shared';
import { AuthService } from '@smart-management/auth';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private userService: UserService = inject(UserService);
  private authService = inject(AuthService);

  getUserProfile(): Observable<User> {
    return of(this.userService.getCurrentUser());
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData: UserProfile, currentPassword: string): Observable<User> {
    return new Observable<User>((observer) => {
      try {
        const currentUser = this.userService.getCurrentUser();

        // Validate current password
        if (!this.authService.validatePassword(currentUser.id!, currentPassword)) {
          observer.error(new Error('Senha atual inválida.'));
          return;
        }

        // Validate name
        if (!userData.name || userData.name.trim().length < 2) {
          observer.error(new Error('Nome deve ter no mínimo 2 caracteres.'));
          return;
        }

        // Build update object
        const updatedData: Partial<User> = {
          ...currentUser,
          name: userData.name.trim(),
        };

        // Update phone if provided
        if (userData.phone && userData.phone.trim().length > 0) {
          updatedData.phone = userData.phone.trim();
        }

        // Update photo if provided
        if (userData.photo) {
          updatedData.photo = userData.photo;
        }

        // Update password if provided and valid
        if (userData.password && userData.password.trim().length >= 6) {
          if (userData.password !== userData.confirmPassword) {
            observer.error(new Error('As senhas não coincidem.'));
            return;
          }
          updatedData.password = userData.password;
        }

        // Update user
        this.userService.updateUser(updatedData as User);
        this.userService.updateCurrentUser(updatedData as User);

        // Return updated user
        const updatedUser = this.userService.getCurrentUser();
        observer.next(updatedUser);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}
