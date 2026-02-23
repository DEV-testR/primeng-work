import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Step, StepList, Stepper} from "primeng/stepper";
import {Fluid} from "primeng/fluid";
import {Panel} from "primeng/panel";
import {Button} from "primeng/button";
import {
    DatePipe,
    DecimalPipe,
    NgClass,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
} from "@angular/common";
import {appProperties} from "../../../../../app.properties";
import {Tooltip} from "primeng/tooltip";
import {FileUploadResult} from "../../../../conponents/files-upload/files-upload.component";
import {FilesUploadService} from "../../../../services/fileupload.service";
import {FileSaverService} from "ngx-filesaver";
import {MessageService} from "primeng/api";
import {ToastMessagesComponent} from "../../../../conponents/toast-messages/toast-messages.component";
import {YesNoPipe} from "../../../../pipes/yes-no.pipe";
import {DocumentService} from "../../../../services/document.service";
import {StepGroup} from "../../../../models/document.model";

@Component({
    selector: 'app-document-flow',
    imports: [
        Stepper,
        StepList,
        Step,
        Fluid,
        Panel,
        Button,
        DatePipe,
        NgForOf,
        NgIf,
        Tooltip,
        ToastMessagesComponent,
        NgSwitch,
        NgSwitchCase,
        YesNoPipe,
        DecimalPipe,
        NgSwitchDefault,
        NgOptimizedImage,
        NgClass
    ],
    templateUrl: './document.flow.component.html',
    styleUrls: ['./document.flow.component.scss'],
    providers: [
        MessageService
    ]
})
export class DocumentFlowComponent implements OnInit {
    protected readonly appProperties = appProperties;
    loading: boolean = false;
    isAllowEdit:boolean = false;
    isActiveStep: boolean = false;
    flowDoc: any;
    flowContent: any;
    flowContentKeys: any;
    flowContentDataType: Map<string, string> = new Map();
    documentForm: any;
    fieldLabels: { [key: string]: string } = {
        documentNo: 'Document No.',
        emId: 'Employee',
        dateWork: 'Work Date',
        reasonId: 'Reason',
        remark: 'Remark'
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private filesUploadService: FilesUploadService,
        private documentService: DocumentService,
        private fileSaver: FileSaverService,
        private readonly messageService: MessageService,
    ) {}

    ngOnInit() {
        this.documentForm = history.state.documentForm;
        this.flowDoc = this.documentForm.flowDoc;
        if (!this.flowDoc) {
            this.router.navigate(['/document'], {relativeTo: this.route}).then(() => console.log('open document page'));
            return;
        }

        // Build Data FlowContent Info
        this.isAllowEdit = this.documentForm.documentStatus === 0;
        this.isActiveStep = this.flowDoc.isActiveStep;
        this.flowContent = { ...this.documentForm };
        delete this.flowContent['id'];
        delete this.flowContent['tmpts'];
        delete this.flowContent['version'];
        delete this.flowContent['updateBy'];
        delete this.flowContent['updateDate'];

        this.flowContentKeys =  Object.keys(this.flowContent);
        for (let fldKey of this.flowContentKeys) {
            const value = this.flowContent[fldKey];
            if (!value) {
                continue;
            }

            const dateType = typeof value;
            switch (dateType) {
                case 'number':
                    if (dateType === 'number' && value > 1000000000) {
                        this.flowContent[fldKey] = new Date(value);
                        this.flowContentDataType.set(fldKey, 'DATE');
                    } else {
                        this.flowContentDataType.set(fldKey, dateType.toUpperCase());
                    }
                    break;
                case 'object':
                    if (Array.isArray(value)) {
                        this.flowContentDataType.set(fldKey, 'LIST');
                        break;
                    }

                    if (value.hasOwnProperty('name')) {
                        this.flowContent[fldKey] = value.name;
                        this.flowContentDataType.set(fldKey, 'STRING');
                        break;
                    }

                    this.flowContentDataType.set(fldKey, dateType.toUpperCase());
                    break;
                default:
                    this.flowContentDataType.set(fldKey, dateType.toUpperCase());
            }
        }

        console.log('FlowDoc:', this.flowDoc);
    }

    pageBack() {
        const backState = (this.isAllowEdit) ? '../form' : '../';
        this.router.navigate([backState], {
            relativeTo: this.route,
            state: { documentForm: this.documentForm, }
        }).then(() => console.log('open form document'));
    }

    ngSubmit() {
        this.documentService.submitFlow(this.documentForm).subscribe({
            next: (response) => {
                console.log('submit', response);
                this.documentForm = response;
                this.flowDoc = this.documentForm.flowDoc;
                this.isActiveStep = this.flowDoc.isActiveStep;
                this.isAllowEdit = this.documentForm.documentStatus === 0;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'Submit Failed.'
                });
                console.error('Submit Error:', err);
            }
        });
    }

    downloadFile(file: FileUploadResult): void {
        this.filesUploadService.downloadFile(file.fileName).subscribe({
            next: (data: Blob) => {
                const label = file.fileLabel || file.fileName;
                this.fileSaver.save(data, label);
            },
            error: (err) => {
                this.showToast('error', 'Download failed');
                console.error(err);
            }
        });
    }

    resolveStepIcon(step: any): string {
        if (step.stepno === 0) {
            return 'pi pi-check';
        }

        if (step.actionDate) {
            return 'pi pi-check';
        }

        if (step.stepno === this.flowDoc?.activeStep) {
            return 'pi pi-hourglass';
        }

        return 'pi pi-lock text-400';
    }

    get groupedSteps(): StepGroup[] {
        if (!this.flowDoc?.steps) return [];

        const groups = this.flowDoc.steps.reduce((acc: Record<number, StepGroup>, curr: StepGroup) => {
            const key = curr.stepno;
            if (!acc[key]) {
                acc[key] = {
                    stepno: key,
                    actions: []
                };
            }
            acc[key].actions.push(curr);
            return acc;
        }, {});

        // ระบุ Type ตรงนี้เพื่อให้ TypeScript รู้ว่า group คือ StepGroup
        return (Object.values(groups) as StepGroup[]).sort((a, b) => a.stepno - b.stepno);
    }

    private showToast(severity: string, detail: string) {
        this.messageService.add({ severity, summary: severity.toUpperCase(), detail, life: 5000 });
    }

}