import { DropdownItem, NavItem } from "../models/navigation.model";

export const navbarRoutes: (NavItem | DropdownItem)[] = [
    { isDropdown: false, label: "Home", route: "/home" },
    { isDropdown: false, label: "Sobre", route: "/about" },
    { isDropdown: false, label: "Contato", route: "/contact" },
    { isDropdown: false, label: "admin", route: "/admin" }
];