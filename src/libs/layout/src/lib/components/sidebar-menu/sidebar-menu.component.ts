import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { navbarRoutes } from '../../config/navbar-routes.config';
import { DropdownItem, NavItem } from '../../models/navigation.model';
import { NavItemComponent } from '../navitem/navitem.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Router } from '@angular/router';

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
export class SidebarMenuComponent {
  @Input() isOpen = true;

  navItems: (NavItem | DropdownItem)[] = navbarRoutes;
  private readonly _route = inject(Router);

  goHome(): void {
    this._route.navigateByUrl('/home');
  }
}
