import {LookupItem} from "./lookup.model";

export interface DocumentCriteria {
    /*private Long emId;
    private String documentNo;
    private String documentType;
    private String documentStatus;
    private Date dateVF;
    private Date dateVT;*/
    emId: string
    documentNo: string;
    documentType: string;
    documentStatus: number;
    dateVF: Date;
    dateVT: Date;
}

export interface DocumentData {
    /*private Long id;
    private String documentNo;
    private String documentType;
    private int documentStatus;
    private Employee emId;
    private Date dateWork;*/
    id: string;
    documentNo: string;
    documentType: string;
    documentStatus: string;
    documentStatusLabel : string;
    documentStatusSeverity : string;
    emId: LookupItem;
    documentDate: Date;
}