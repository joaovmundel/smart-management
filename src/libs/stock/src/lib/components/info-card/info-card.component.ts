import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sm-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
})
export class InfoCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() content?: string;
  @Input() value?: string | number;
  @Input() icon?: string;
  @Input() color?: 'primary' | 'accent' | 'warn' | 'success' | 'info';
  @Input() trend?: 'up' | 'down' | 'neutral';
  @Input() trendValue?: string;
}