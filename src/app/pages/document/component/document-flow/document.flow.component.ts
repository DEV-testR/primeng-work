import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Step, StepList, Stepper} from "primeng/stepper";
import {Fluid} from "primeng/fluid";
import {Panel} from "primeng/panel";
import {Button} from "primeng/button";
import {DatePipe, DecimalPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {appProperties} from "../../../../../app.properties";
import {Tooltip} from "primeng/tooltip";
import {FileUploadResult} from "../../../../conponents/files-upload/files-upload.component";
import {FilesUploadService} from "../../../../services/fileupload.service";
import {FileSaverService} from "ngx-filesaver";
import {MessageService} from "primeng/api";
import {ToastMessagesComponent} from "../../../../conponents/toast-messages/toast-messages.component";
import {YesNoPipe} from "../../../../pipes/yes-no.pipe";

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
        NgSwitchDefault
    ],
    templateUrl: './document.flow.component.html',
    providers: [
        MessageService
    ]
})
export class DocumentFlowComponent implements OnInit {
    protected readonly appProperties = appProperties;
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
        private fileSaver: FileSaverService,
        private readonly messageService: MessageService,
    ) {}

    ngOnInit() {
        this.flowDoc = history.state.flowDoc;
        if (!this.flowDoc) {
            this.router.navigate(['/document'], {relativeTo: this.route}).then(() => console.log('open document page'));
            return;
        }

        this.documentForm = this.flowDoc.documentForm;

        // Build Data FlowContent Info
        this.flowContent = { ...this.documentForm };
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
                    }
                    break;
                default:
                    this.flowContentDataType.set(fldKey, dateType.toUpperCase());
            }
        }

        console.log('FlowDoc:', this.flowDoc);
    }

    pageBack() {
        this.router.navigate(['../form'], {
            relativeTo: this.route,
            state: { documentForm: this.documentForm, }
        }).then(() => console.log('open form document'));
    }

    ngSubmit() {

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

    private showToast(severity: string, detail: string) {
        this.messageService.add({ severity, summary: severity.toUpperCase(), detail, life: 5000 });
    }

    originalOrder = (a: any, b: any): number => {
        return 0;
    }
}