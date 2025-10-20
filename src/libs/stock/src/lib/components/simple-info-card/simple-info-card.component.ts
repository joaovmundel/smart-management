import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

export type SimpleInfoItem = {
    label: string;
    value?: string | number;
    color?: 'green' | 'blue' | 'red' | 'gray' | string;
    small?: boolean;
};

@Component({
    selector: 'sm-simple-info-card',
    templateUrl: './simple-info-card.component.html',
    styleUrls: ['./simple-info-card.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class SimpleInfoCardComponent {
    @Input() title = '';
    @Input() subtitle = '';
    @Input() items: SimpleInfoItem[] = [];
    @Input() compact = false;
}