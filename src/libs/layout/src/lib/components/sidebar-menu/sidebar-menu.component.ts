import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserService } from '@smart-management/shared';
import { navbarRoutes } from '../../config/navbar-routes.config';
import { DropdownItem, NavItem } from '../../models/navigation.model';
import { SidebarService } from '../../services/sidebar.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NavItemComponent } from '../navitem/navitem.component';

@Component({
  selector: 'sm-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    NavItemComponent,
    DropdownComponent,
  ],
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  navItems: (NavItem | DropdownItem)[] = [];

  private readonly _router = inject(Router);
  private readonly _sidebarService = inject(SidebarService);
  private readonly _userService = inject(UserService);

  private subscriptions = new Subscription();

  isOpen$ = this._sidebarService.isOpen$;
  isMobile$ = this._sidebarService.isMobile$;

  ngOnInit(): void {
    this.checkScreenSize();
    this.setupRouterListener();
    this.filterNavItems();
  }

  private filterNavItems(): void {
    const currentUser = this._userService.getCurrentUser();
    const isAdmin = currentUser?.role === 'ADMIN';

    if (isAdmin) {
      this.navItems = navbarRoutes;
    } else {
      this.navItems = navbarRoutes.filter(item => {
        if ('isDropdown' in item && item.label === 'Admin') {
          return false;
        }
        return true;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth < 768; // Breakpoint para mobile
    this._sidebarService.setIsMobile(isMobile);
  }

  private setupRouterListener(): void {
    const routerSub = this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this._sidebarService.closeIfMobile();
      });

    this.subscriptions.add(routerSub);
  }

  goHome(): void {
    this._router.navigateByUrl('/home');
  }

  toggleSidebar(): void {
    this._sidebarService.toggle();
  }

  closeSidebar(): void {
    this._sidebarService.close();
  }

  onItemClick(): void {
    this._sidebarService.closeIfMobile();
  }
}
