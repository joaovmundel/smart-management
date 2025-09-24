import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarMenuComponent } from '../components/sidebar-menu/sidebar-menu.component';
import { NewHeaderComponent } from '../components/new-header/new-header.component';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarMenuComponent, NewHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent { }
