import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'sm-logout',
  standalone: true,
  template: '',
})
export class LogoutComponent implements OnInit {
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this._authService.logout();
  }
}
