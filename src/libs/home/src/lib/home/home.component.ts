import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '@smart-management/layout';

@Component({
  selector: 'lib-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  private readonly _titleService = inject(TitleService); 

  ngOnInit(): void {
    this._titleService.setTitle('Página Inicial');
  }
}
