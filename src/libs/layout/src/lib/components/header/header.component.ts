import { Component } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from "@angular/common";
import { DropdownItem, NavItem } from "../../models/navigation.model";
import { RouterModule } from "@angular/router";
import { navbarRoutes } from "../../config/navbar-routes.config";
import { NavItemComponent } from "../navitem/navitem.component";

@Component({
    selector: "lib-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, CommonModule, RouterModule, NavItemComponent]
})
export class HeaderComponent {
    navItems: (NavItem | DropdownItem)[] = navbarRoutes;
}