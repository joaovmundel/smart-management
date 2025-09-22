import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmButtonComponent } from '@smart-management/ui';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, SmButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
