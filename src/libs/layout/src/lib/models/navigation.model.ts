export interface NavItem {
    isDropdown?: boolean;
    label: string;
    route: string;
}

export interface DropdownItem {
    isDropdown: boolean;
    label: string;
    routes: NavItem[];
}
