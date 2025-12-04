import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, UserService } from '@smart-management/shared';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private userService: UserService) {}

  getUserProfile(): Observable<User> {
    return of(this.userService.getCurrentUser());
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    // TODO: Get current user ID from JWT token or auth service
    return of();
  }
}
