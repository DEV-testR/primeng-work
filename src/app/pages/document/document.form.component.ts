import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators
} from "@angular/forms";
import {Fluid} from "primeng/fluid";
import {DocumentData} from "../../models/document.model";
import {DocumentService} from "../../services/document.service";
import {ToastMessagesComponent} from "../../conponents/toast-messages/toast-messages.component";
import {MenuItem, MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {Location, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUpload} from "primeng/fileupload";
import {DatePicker} from "primeng/datepicker";
import {LookupAutocompleteComponent} from "../../conponents/lookup-autocomplete/lookup-autocomplete.component";
import {Textarea} from "primeng/textarea";
import {appProperties} from "../../../app.properties";

@Component({
    selector: 'app-document',
    templateUrl: './document.form.component.html',
    imports: [
        Button,
        FormsModule,
        Fluid,
        ReactiveFormsModule,
        ToastMessagesComponent,
        TableModule,
        FileUpload,
        DatePicker,
        LookupAutocompleteComponent,
        Textarea,
        NgForOf,
        NgIf,
    ],
    styleUrls: ['./document.component.scss'],
    providers: [DocumentService, MessageService]
})
export class DocumentFormComponent implements OnInit {
    loading: boolean = false;
    isValidateFailed: boolean = false;
    documentList: DocumentData[] = [];
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    requestForm!: UntypedFormGroup;
    uploadedFiles: any[] = [];

    constructor(
        fb: UntypedFormBuilder,
        private readonly messageService: MessageService,
        private documentService: DocumentService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.requestForm = fb.group({});
    }

    ngOnInit(): void {
        /*this.buildBreadcrumb();*/
        const today = new Date();
        this.requestForm = new UntypedFormGroup({
            employee: new UntypedFormControl(null, Validators.required),
            dateWork: new UntypedFormControl(today, Validators.required),
            dateTo: new UntypedFormControl(today),
            punI_D: new UntypedFormControl(today),
            punI_T: new UntypedFormControl(today),
            punO_D: new UntypedFormControl(today),
            punO_T: new UntypedFormControl(today),
            reason: new UntypedFormControl(null, Validators.required),
            remark: new UntypedFormControl(null),
            attachment: new UntypedFormControl(null)
        });
    }

    /*private buildBreadcrumb() {
        let route = this.route.root;
        const breadcrumbs: MenuItem[] = [];
        let url = '';
        while (route.firstChild) {
            route = route.firstChild;
            const routeURL = route.snapshot.url
                .map(segment => segment.path)
                .join('/');
            if (routeURL) {
                url += `/${routeURL}`;
            }

            if (route.snapshot.data['breadcrumb']) {
                breadcrumbs.push({
                    label: route.snapshot.data['breadcrumb'],
                    routerLink: url
                });
            }
        }
        this.items = breadcrumbs;
    }*/

    onSubmit() {
        const requestForm : UntypedFormGroup = this.requestForm;
        this.isValidateFailed = requestForm.invalid;
        if (this.isValidateFailed) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Validation failed'
            });
            return;
        }

        this.requestForm.disable();
        const criteria : any = requestForm.value;
        console.log('Search Criteria:', criteria);
        this.loading = true;

        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Document Created'
            });
        }, 800);
    }

    onCancel() {
        this.location.back();
    }

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    protected readonly appProperties = appProperties;
}