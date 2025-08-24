import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavItem } from "../../models/navigation.model";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "lib-navitem",
    templateUrl: "./navitem.component.html",
    styleUrls: ["./navitem.component.scss"],
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule]
})
export class NavItemComponent {
    @Input() item!: NavItem;
}