import {LookupItem} from "./lookup.model";

export interface DocumentCriteria {
    emId: string
    documentNo: string;
    documentType: string;
    documentStatus: number;
    dateVF: Date;
    dateVT: Date;
}

export interface DocumentData {
    id: string;
    documentNo: string;
    documentType: string;
    documentStatus: string;
    documentStatusLabel : string;
    documentStatusSeverity : string;
    emId: LookupItem;
    dateWork: Date;
}

export interface StepGroup {
    stepno: number;
    actions: any[]; // หรือเปลี่ยน any เป็น Type ของ Step Entity คุณ
}