import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {DocumentData} from "../../models/document.model";
import {DocumentService} from "../../services/document.service";
import {MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router} from "@angular/router";
import {appProperties} from "../../../app.properties";
import {RecordTypeService} from "../../services/recordtype.service";
import {RecordType} from "../../models/recordtype.model";

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

    ngOnInit(): void {
        console.log('ngOnInit');
        this.initForm();
    }

    initForm() {
        const today : Date = new Date();
        /*this.searchForm.addControl("documentType", new UntypedFormControl('TIME', { nonNullable: true }));
        this.searchForm.addControl("documentStatus", new UntypedFormControl('-1', { nonNullable: true }));
        this.searchForm.addControl("emId", new UntypedFormControl(null));
        this.searchForm.addControl("month", new UntypedFormControl(today.getMonth()));
        this.searchForm.addControl("year", new UntypedFormControl(today.getFullYear()));*/
    }

}