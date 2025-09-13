import { Component } from "@angular/core";
import { ProductFormComponent } from "../../components/product-form/product-form.component";
import { Product } from "../../models/product.model";

@Component({
    selector: "sm-product-creation",
    templateUrl: "./product-creation.component.html",
    styleUrls: ["./product-creation.component.scss"],
    standalone: true,
    imports: [ProductFormComponent],
})
export class ProductCreationComponent {
    // Component logic goes here

    onSave(product: Product) {
        // Handle save action
        console.log("Product saved:", product);
    }
    onCancel() {
        // Handle cancel action
        console.log("Product creation cancelled");
    }
}