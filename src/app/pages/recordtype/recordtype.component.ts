import {Component, OnInit} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup
} from "@angular/forms";
import {MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router} from "@angular/router";
import {appProperties} from "../../../app.properties";
import {RecordTypeService} from "../../services/recordtype.service";
import {RecordType, RecordTypeField} from "../../models/recordtype.model";
import {firstValueFrom} from "rxjs";

@Component({
    selector: 'app-recordtype',
    templateUrl: './recordtype.component.html',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TableModule,
    ],
    styleUrls: ['./recordtype.component.scss'],
    providers: [RecordTypeService, MessageService]
})
export class RecordTypeComponent implements OnInit {
    searchForm!: UntypedFormGroup;
    loading: boolean = false;
    isValidateFailed: boolean = false;
    displayConfirmation: boolean = false;
    messageConfirm: string = '';
    item :RecordType | undefined;
    itemDelete :RecordType | undefined;
    itemList: RecordType[] = [];
    protected readonly appProperties = appProperties;

    constructor(
        fb: UntypedFormBuilder,
        private readonly messageService: MessageService,
        private recordtypeService: RecordTypeService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.searchForm = fb.group({});
    }

    async ngOnInit(): Promise<void> { // 2. ใส่ async และเปลี่ยน return type เป็น Promise
        const recordTypeName = this.route.snapshot.paramMap.get('name') || 'AC_RecordType';
        console.log(`ngOnInit recordtype name : ${recordTypeName}`);

        this.loading = true;

        try {
            const res = await firstValueFrom(this.recordtypeService.search(recordTypeName));
            console.log('recordtypeService.search result : ', res);
            this.item = new RecordType(res);

            const filterFields: RecordTypeField[] = this.item.filterFields || [];
            filterFields
                .filter((field): field is RecordTypeField & { name: string } => !!field.name)
                .forEach(field => {
                    this.searchForm.addControl(field.name, new UntypedFormControl(null));
                });

        } catch (err: any) {
            console.error('search data failed', err);
            this.messageService.add({
                severity: 'error',
                summary: `Error ${err.status}`,
                detail: err.statusText
            });
        } finally {
            this.loading = false;
        }
    }

}