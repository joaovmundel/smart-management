import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { navbarRoutes } from '../../config/navbar-routes.config';
import { DropdownItem, NavItem } from '../../models/navigation.model';
import { NavItemComponent } from '../navitem/navitem.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  navItems: (NavItem | DropdownItem)[] = navbarRoutes;
  
  private readonly _router = inject(Router);
  private readonly _sidebarService = inject(SidebarService);
  
  private subscriptions = new Subscription();
  
  // Propriedades reativas do sidebar
  isOpen$ = this._sidebarService.isOpen$;
  isMobile$ = this._sidebarService.isMobile$;

  ngOnInit(): void {
    this.checkScreenSize();
    this.setupRouterListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Detecta mudanças no tamanho da tela
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  /**
   * Verifica se está em modo mobile
   */
  private checkScreenSize(): void {
    const isMobile = window.innerWidth < 768; // Breakpoint para mobile
    this._sidebarService.setIsMobile(isMobile);
  }

  /**
   * Configura listener para fechar sidebar em mobile após navegação
   */
  private setupRouterListener(): void {
    const routerSub = this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this._sidebarService.closeIfMobile();
      });

    this.subscriptions.add(routerSub);
  }

  /**
   * Navega para home
   */
  goHome(): void {
    this._router.navigateByUrl('/home');
  }

  /**
   * Alterna o estado do sidebar
   */
  toggleSidebar(): void {
    this._sidebarService.toggle();
  }

  /**
   * Fecha o sidebar
   */
  closeSidebar(): void {
    this._sidebarService.close();
  }

  /**
   * Fecha sidebar quando clica em item (útil para mobile)
   */
  onItemClick(): void {
    this._sidebarService.closeIfMobile();
  }
}
