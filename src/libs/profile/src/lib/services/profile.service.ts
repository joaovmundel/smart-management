import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserService } from '@smart-management/shared';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private userService: UserService) {}

  /**
   * Get current user profile
   * Note: This would typically get the current user's ID from a JWT token or auth service
   * For now, we'll use a placeholder
   */
  getUserProfile(): Observable<User> {
    // TODO: Get current user ID from JWT token or auth service
    const currentUserId = 1; // This should come from JWT token
    return this.userService.getUser(currentUserId);
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    // TODO: Get current user ID from JWT token or auth service
    const currentUserId = 1; // This should come from JWT token
    return this.userService.updateUser(currentUserId, userData);
  }
}