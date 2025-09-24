import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: "sm-input",
    templateUrl: "./sm-input.component.html",
    styleUrls: ["./sm-input.component.scss"],
    standalone: true,
    imports: [CommonModule],
})
export class SmInputComponent {}