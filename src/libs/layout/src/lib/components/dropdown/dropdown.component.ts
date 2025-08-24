import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { DropdownItem } from '../../models/navigation.model';

@Component({
  selector: 'lib-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule, MatButtonModule],
})
export class DropdownComponent {
  @Input() item!: DropdownItem;
}
