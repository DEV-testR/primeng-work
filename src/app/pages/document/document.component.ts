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
import {MonthYearFilterComponent} from "../../conponents/month-year-filter/month-year-filter.component";
import {LookupAutocompleteComponent} from "../../conponents/lookup-autocomplete/lookup-autocomplete.component";
import {DocumentStatusFilter} from "../../conponents/document-status-filter/document-status-filter";
import {DocumentCriteria, DocumentData} from "../../models/document.model";
import {DocumentService} from "../../services/document.service";
import {ToastMessagesComponent} from "../../conponents/toast-messages/toast-messages.component";
import {MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    imports: [
        Button,
        FormsModule,
        Fluid,
        MonthYearFilterComponent,
        LookupAutocompleteComponent,
        DocumentStatusFilter,
        ReactiveFormsModule,
        ToastMessagesComponent,
        TableModule,
        NgIf,


    ],
    styleUrls: ['./document.component.scss'],
    providers: [DocumentService, MessageService]
})
export class DocumentComponent implements OnInit {
    searchForm!: UntypedFormGroup;
    loading: boolean = false;
    isValidateFailed: boolean = false;
    documentList: DocumentData[] = [];
    constructor(
        fb: UntypedFormBuilder,
        private readonly messageService: MessageService,
        private documentService: DocumentService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.searchForm = fb.group({});
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        const today : Date = new Date();
        this.searchForm.addControl("type", new UntypedFormControl('CheckIn', { nonNullable: true }));
        this.searchForm.addControl("status", new UntypedFormControl('-1', { nonNullable: true }));
        this.searchForm.addControl("employee", new UntypedFormControl(null, [Validators.required]));
        this.searchForm.addControl("month", new UntypedFormControl(today.getMonth()));
        this.searchForm.addControl("year", new UntypedFormControl(today.getFullYear()));
    }

    onCreate() {
        // await this.router.navigate(['/documents/form']);
        this.router.navigate(['form'], { relativeTo: this.route });
    }

    onSearch() {
        const searchForm : UntypedFormGroup = this.searchForm;
        this.isValidateFailed = searchForm.invalid;
        if (this.isValidateFailed) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Validation failed'
            });
            return;
        }

        const criteria : DocumentCriteria = searchForm.value;
        console.log('Search Criteria:', criteria);
        this.loading = true;
        /*this.documentService.search(criteria).subscribe({
            next: (res) => {
                this.loading = false;
                this.documentList = res;
                if (this.documentList.length === 0) {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No data found' });
                }
            },
            error: (err) => {
                this.loading = false;
                console.error('search data failed', err);
                this.messageService.add({ severity: 'error', summary: `Error ${err.status}`, detail: err.statusText });
            }
        });*/

        // จำลองการเรียก API (ใช้ setTimeout เพื่อเลียนแบบ Network Latency)
        setTimeout(() => {
            this.documentList = this.generateMockData(this.searchForm.value);
            this.loading = false;

            this.messageService.add({
                severity: 'success',
                summary: 'Search Completed',
                detail: `Found ${this.documentList.length} records.`
            });
        }, 800);
    }

    private generateMockData(criteria: any): any[] {
        const statuses = [
            { val: '0', label: 'Drafts', severity: 'secondary' },
            { val: '1', label: 'Waiting', severity: 'warn' },
            { val: '2', label: 'Approved', severity: 'success' },
            { val: '11', label: 'Not Approved', severity: 'danger' },
            { val: '12', label: 'Cancel', severity: 'contrast' }
        ];

        // สร้างข้อมูลจำลอง 5-10 แถว
        return Array.from({ length: 100 }).map((_, i) => {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return {
                id: i + 1,
                documentNo: `DOC-2026-${(i + 101).toString()}`,
                employeeCode: criteria.employee || `E2111-${(i + 1).toString().padStart(4, '0')}`,
                employeeName: `Staff Name ${i + 1}`,
                documentDate: `${criteria.year || 2569}-${(criteria.month || 2).toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`,
                statusLabel: randomStatus.label,
                statusSeverity: randomStatus.severity,
                amount: (Math.random() * 10000).toFixed(2)
            };
        });
    }
}