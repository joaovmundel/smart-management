import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavItem } from "../../models/navigation.model";

@Component({
    selector: "lib-navitem",
    templateUrl: "./navitem.component.html",
    styleUrls: ["./navitem.component.scss"],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class NavItemComponent {
    @Input() item!: NavItem;
}