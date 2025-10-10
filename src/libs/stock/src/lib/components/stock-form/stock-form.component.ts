import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'sm-stock-form',
    templateUrl: './stock-form.component.html',
    styleUrls: ['./stock-form.component.scss'],
    standalone: true,
    imports: []
})
export class StockFormComponent {
    private formBuilder = inject(FormBuilder);

    stockForm!: FormGroup;

    constructor() {
        this.stockForm = this.formBuilder.group({
            product: new FormControl(''),
            current_amount: new FormControl(0),
            min_amount: new FormControl(0),
            max_amount: new FormControl(0),
        });
    }

    onSave(): void {
        console.log(this.stockForm.value);
    }
}