import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { DropdownItem } from '../../models/navigation.model';
import {MatExpansionModule} from '@angular/material/expansion';
import { NavItemComponent } from '../navitem/navitem.component';

@Component({
  selector: 'lib-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule, MatButtonModule, MatExpansionModule, NavItemComponent],
})
export class DropdownComponent {
  @Input() item!: DropdownItem;
  @Input() isSuspended = false;
  readonly _open = signal(false);
}
