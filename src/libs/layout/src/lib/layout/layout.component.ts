import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarMenuComponent } from '../components/sidebar-menu/sidebar-menu.component';
import { NewHeaderComponent } from '../components/new-header/new-header.component';
import { filter } from 'rxjs';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarMenuComponent, NewHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild('contentContainer') contentContainer?: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Escuta mudanças de rota e reseta o scroll
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.contentContainer) {
          this.contentContainer.nativeElement.scrollTop = 0;
        }
      });
  }
}
