import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'sm-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.scss'],
    standalone: true,
    imports: [CommonModule, MatExpansionModule, MatIconModule]
})
export class StockComponent { 
    isFormExpanded = false;

    onToggleForm() {
        this.isFormExpanded = !this.isFormExpanded;
    }
}