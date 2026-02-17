import {Component, forwardRef, Input, OnInit, ViewChild} from "@angular/core";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AutoComplete} from "primeng/autocomplete";
import {LookupService} from "../../services/lookup.service";
import {LookupResponse} from "../../models/lookupResponse.model";

interface lookupItem {
    label: string;
    value: string;
}

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    selector: 'app-lookup-autocomplete',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LookupAutocompleteComponent),
            multi: true
        }
    ],
    styleUrls: ['./lookup-autocomplete.component.scss'],
    template: `
        <div class="flex flex-col gap-1 w-full">
            <p-autocomplete [(ngModel)]="selectedItem"
                            [virtualScroll]="true"
                            [suggestions]="filteredItems"
                            [virtualScrollItemSize]="34"
                            (completeMethod)="filterItems($event)"
                            (onSelect)="onItemSelect($event)"
                            (onFocus)="showAllItems($event)"
                            (onClear)="onClear()"
                            (onBlur)="onTouched()"
                            [minLength]="0"
                            optionLabel="label"
                            [dropdown]="true"
                            dropdownIcon="pi pi-search"
                            [style]="{'width': '100%'}"
                            [inputStyle]="{'width': '100%'}"
                            [inputStyleClass]="isValidateFailed ? 'ng-invalid ng-dirty' : ''"
                            placeholder="Search">
            </p-autocomplete>
        </div>`,

    imports: [
        FormsModule,
        AutoComplete
    ]
})

export class LookupAutocompleteComponent implements ControlValueAccessor, OnInit {
    @Input() clazzName: string = '';
    @Input() isValidateFailed: boolean | undefined;
    @ViewChild(AutoComplete) autoComplete!: AutoComplete;

    items: lookupItem[] = [];
    filteredItems: lookupItem[] = [];
    selectedItem: lookupItem | undefined;
    private pendingValue: any;
    private isSelecting = false;

    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(private lookupService: LookupService) {}

    ngOnInit(): void {
        if (this.clazzName) {
            this.loadLookupData();
        }
    }

    private loadLookupData(): void {
        this.lookupService.fetchDataLookup(this.clazzName).subscribe({
            next: (res: LookupResponse[]) => {
                this.items = res.map(item => ({
                    label: `${item.code} : ${item.name}`,
                    value: item.id
                }));

                if (this.pendingValue) {
                    this.writeValue(this.pendingValue);
                }
            },
            error: (err) => console.error('Error:', err)
        });
    }

    writeValue(val: any): void {
        if (val) {
            if (this.items.length > 0) {
                this.selectedItem = this.items.find(i => i.value === val);
                this.pendingValue = null;
            } else {
                this.pendingValue = val;
            }
        } else {
            this.selectedItem = undefined;
        }
    }

    onItemSelect(event: any) {
        this.isSelecting = true;
        const value = event.value.value;
        this.writeValue(value);
        this.onChange(value);

        if (this.autoComplete) {
            this.autoComplete.hide();
        }
    }

    onClear() {
        this.isSelecting = false;
        this.selectedItem = undefined;
        this.onChange(null);
    }

    showAllItems(event: any) {
        // ถ้ากำลังอยู่ในขั้นตอนเลือก item หรือมีการเลือกไปแล้ว ไม่ต้องโชว์ซ้ำ
        if (this.isSelecting) {
            this.isSelecting = false; // reset flag
            return;
        }

        console.log('showAllItems', event);
        this.filteredItems = [...this.items];

        setTimeout(() => {
            if (this.autoComplete && !this.selectedItem) { // เพิ่มเช็กถ้ามีค่าอยู่แล้วอาจจะไม่ต้องโชว์
                this.autoComplete.show();
            }
        }, 150);
    }

    filterItems(event: any) {
        console.log('filterItems....');
        const query = (event.query || '').toLowerCase();
        if (!query) {
            this.filteredItems = [...this.items];
        } else {
            this.filteredItems = this.items.filter(item =>
                item.label.toLowerCase().includes(query) ||
                String(item.value).toLowerCase().includes(query)
            );
        }
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
}
