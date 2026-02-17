import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {DataView} from "primeng/dataview";
import {Tag} from "primeng/tag";
import {Product, ProductService} from "../service/product.service";

@Component({
    selector: 'app-run-payroll',
    templateUrl: './run-payroll.component.html',
    imports: [
        Button,
        FormsModule,
        DataView,
        NgForOf,
        Tag,
        NgClass,
    ],
    styleUrls: ['./run-payroll.component.scss'],
    providers: [ProductService]
})
export class RunPayrollComponent implements OnInit {
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];
    products: Product[] = [];
    sourceCities: any[] = [];
    targetCities: any[] = [];
    orderCities: any[] = [];
    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.getProductsSmall().then((data) => (this.products = data.slice(0, 6)));
        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }
        ];
        this.targetCities = [];
        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }
        ];
    }

    getSeverity(product: Product) {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'info';
        }
    }
}