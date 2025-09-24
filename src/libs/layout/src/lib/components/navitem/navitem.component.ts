import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../models/navigation.model';

@Component({
  selector: 'lib-navitem',
  templateUrl: './navitem.component.html',
  styleUrls: ['./navitem.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
})
export class NavItemComponent {
  @Input() isSuspended = false;
  @Input() item!: NavItem;
  @Input() hasIcon = false;
  @Input() iconName = '';
  @Input() iconPosition: 'start' | 'end' = 'start';
}
