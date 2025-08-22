import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DropdownItem } from "../../models/navigation.model";
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: "lib-dropdown",
    templateUrl: "./dropdown.component.html",
    styleUrls: ["./dropdown.component.scss"],
    standalone: true,
    imports: [CommonModule, RouterModule, MatMenuModule]
})
export class DropdownComponent {
    @Input() item!: DropdownItem;
}