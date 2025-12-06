import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../../services/sidebar.service';
import { TitleService } from '../../services/title.service';
import { User, UserService } from '@smart-management/shared';

@Component({
  selector: 'lib-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class NewHeaderComponent implements OnInit, OnDestroy {
  @Input() title = '';

  public currentTitle = '';
  public user: User | null = null;
  public isProfileDropdownOpen = false;
  public defaultAvatar =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2ZjEiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcgMjAgMjAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNDI3MSAyMiAyMiAyMkgxOEMxMy41NzI5IDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=';

  private titleSubscription?: Subscription;
  private readonly sidebarService = inject(SidebarService);
  private readonly _userService = inject(UserService);

  isOpen$ = this.sidebarService.isOpen$;

  constructor(private titleService: TitleService, private router: Router) {}

  ngOnInit(): void {
    if (this.title) {
      this.currentTitle = this.title;
      this.titleService.setTitle(this.title);
    } else {
      this.titleSubscription = this.titleService.title$.subscribe(
        (title) => (this.currentTitle = title)
      );
    }

    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const profileButton = target.closest('.profile-button');
    const profileDropdown = target.closest('.profile-dropdown');

    // Only close if clicking outside both button and dropdown
    if (!profileButton && !profileDropdown && this.isProfileDropdownOpen) {
      this.isProfileDropdownOpen = false;
    }
  }

  navigateToProfile(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.isProfileDropdownOpen = false;
    // TODO: Implement logout logic
    this.router.navigate(['/login']);
  }

  private loadUserProfile(): void {
    this.user = this._userService.getCurrentUser();
  }

  getUserPhoto(): string {
    return this.user?.photo || this.defaultAvatar;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultAvatar;
  }
}
