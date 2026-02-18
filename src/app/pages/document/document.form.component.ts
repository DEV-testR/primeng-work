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
import {Location, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePicker} from "primeng/datepicker";
import {LookupAutocompleteComponent} from "../../conponents/lookup-autocomplete/lookup-autocomplete.component";
import {Textarea} from "primeng/textarea";
import {appProperties} from "../../../app.properties";
import {FilesUploadComponent} from "../../conponents/files-upload/files-upload.component";

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
        DatePicker,
        LookupAutocompleteComponent,
        Textarea,
        NgIf,
        FilesUploadComponent,
    ],
    styleUrls: ['./document.component.scss'],
    providers: [DocumentService, MessageService]
})
export class DocumentFormComponent implements OnInit {
    loading: boolean = false;
    isValidateFailed: boolean = false;
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    requestForm!: UntypedFormGroup;

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
            emId: new UntypedFormControl(null, Validators.required),
            dateWork: new UntypedFormControl(today, Validators.required),
            dateTo: new UntypedFormControl(today),
            punI_D: new UntypedFormControl(today),
            punI_T: new UntypedFormControl(today),
            punO_D: new UntypedFormControl(today),
            punO_T: new UntypedFormControl(today),
            reasonId: new UntypedFormControl(null, Validators.required),
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
        const requestForm: UntypedFormGroup = this.requestForm;
        this.isValidateFailed = requestForm.invalid;

        if (this.isValidateFailed) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            });
            return;
        }

        const payload = { ...requestForm.value };
        payload.documentStatus = 1;
        payload.documentType = 'TIME';
        this.loading = true;
        requestForm.disable();

        this.documentService.submit(payload).subscribe({
            next: (response) => {
                console.log('submit', response);
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'บันทึกเอกสารเรียบร้อยแล้ว'
                });

                // สามารถจัดการต่อได้ เช่น reset form หรือไปหน้าอื่น
                // this.resetForm();
            },
            error: (err) => {
                // เกิดข้อผิดพลาด
                this.loading = false;
                requestForm.enable(); // เปิดให้แก้ไขได้ใหม่
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'ไม่สามารถบันทึกข้อมูลได้'
                });
                console.error('Submit Error:', err);
            }
        });
    }

    onCancel() {
        this.location.back();
    }

    protected readonly appProperties = appProperties;
}