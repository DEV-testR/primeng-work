import {Component, forwardRef, Input, OnInit, ViewChild} from "@angular/core";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AutoComplete} from "primeng/autocomplete";
import {LookupService} from "../../services/lookup.service";
import {LookupResponse} from "../../models/lookupResponse.model";
import {LookupItem} from "../../models/lookup.model";

interface autoCompleteItem {
    label: string;
    value: string;
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
                            [disabled]="disabled"
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

    sourceItems: LookupItem[] = [];
    filteredItems: autoCompleteItem[] = [];
    selectedItem: autoCompleteItem | undefined;
    disabled: boolean = false;
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

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private loadLookupData(): void {
        this.lookupService.fetchDataLookup(this.clazzName).subscribe({
            next: (res: LookupResponse[]) => {
                this.sourceItems = res.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                }));

                if (this.pendingValue) {
                    this.writeValue(this.pendingValue);
                }
            },
            error: (err) => console.error('Error:', err)
        });
    }

    writeValue(val: any): void {
        if (!val) {
            this.selectedItem = undefined;
            this.pendingValue = null;
            return;
        }

        if (this.sourceItems.length === 0) {
            this.pendingValue = val;
            this.selectedItem = undefined;
            return;
        }

        const targetId: string = val.id ? val.id : val;
        const foundItem: LookupItem | undefined = this.sourceItems.find(i => String(i.id) === String(targetId));

        if (foundItem) {
            this.selectedItem = {
                label: `${foundItem.code} : ${foundItem.name}`,
                value: foundItem.id
            };
            this.pendingValue = null;
        } else {
            this.selectedItem = undefined;
        }
    }

    onItemSelect(event: any) {
        this.isSelecting = true;
        const selected = event.value;
        const value : string = selected.value;
        this.writeValue(value);

        const outValue = this.sourceItems.find(item => item.id === value);
        this.onChange(outValue);
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
        if (this.isSelecting || this.disabled) {
            return;
        }

        if (this.isSelecting) {
            this.isSelecting = false; // reset flag
            return;
        }

        console.log('showAllItems', event);
        this.filteredItems = [...this.sourceItems].map(item => ({
            label: `${item.code} : ${item.name}`,
            value: item.id
        }));

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
            this.filteredItems = [...this.sourceItems].map(item => ({
                label: `${item.code} : ${item.name}`,
                value: item.id
            }));
        } else {
            this.filteredItems = this.sourceItems.filter(item =>
                item.code.toLowerCase().includes(query) ||
                item.name.toLowerCase().includes(query)
            ).map(item => ({
                label: `${item.code} : ${item.name}`,
                value: item.id
            }));
        }
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
}
