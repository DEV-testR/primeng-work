/** 1. ต้องเป็น Class เพื่อให้ลูกหลานสืบทอด properties ได้จริง */
export class GenericPersistentObject {
    createdBy?: string;
    createdDate?: Date | string | number;
    updatedBy?: string;
    updatedDate?: Date | string | number;
}

export class RecordType extends GenericPersistentObject {
    id!: string;
    name!: string;
    label!: string;
    inactive: boolean = false;
    custom: boolean = false;
    schemaField: boolean = false;
    loadOnInit: boolean = false;
    recordtypeFields: RecordTypeField[] = [];

    className?: string;
    customActions?: string;
    customFrom?: string;
    customGroup?: string;
    customOrder?: string;
    customQueryType?: string;
    customSelect?: string;
    customWhere?: string;
    description?: string;
    eacFilter?: string;
    entityType?: string;
    expDate?: Date | string | number;
    groupMenu?: string;
    groupMenuCode?: string;
    hbmFile?: string;
    helpText?: string;
    hint?: string;
    tableName?: string;
    indexField?: string;
    licType?: string;
    menuOrder?: number;
    namespace?: string;
    onAfterQuery?: string;
    onBeforeDelete?: string;
    onBeforeQuery?: string;
    onBeforeSave?: string;
    onAfterSave?: string;
    formDTOClass?: string;
    overrideRecordType?: string;
    overrideByRecordType?: string;
    patFilter?: string;
    patId?: string;
    prop?: any;
    refRecordType?: string;
    remarks?: string;
    reportFilename?: string;
    scripts?: string;
    scriptStat?: string;
    serviceClass?: string;
    tab?: string;
    unity?: string;
    valstr?: string;

    constructor(data?: Partial<RecordType>) {
        super();
        if (data) {
            Object.assign(this, data);
            if (data.recordtypeFields) {
                this.recordtypeFields = data.recordtypeFields.map(f => new RecordTypeField(f));
            }
        }
    }

    /** * Getter function สำหรับดึง Filter Fields
     * ใช้ filterFields แทน getFilterFields() เพื่อความสะดวกใน Template
     */
    get filterFields(): RecordTypeField[] {
        return (this.recordtypeFields || [])
            .filter(field => (field.filterField && field.filterKey))
            .sort((a, b) => (a.fieldSeq || 0) - (b.fieldSeq || 0));
    }
}

export class RecordTypeField extends GenericPersistentObject {
    id!: string;
    name?: string;
    label?: string;
    dataType?: string;
    advFilterEn?: boolean;
    isSearchRequired?: boolean;
    displaySeq?: number;

    // Fields อื่นๆ ที่คุณมีใน Entity
    defaultPattern?: string;
    defaultValue?: string;
    description?: string;
    displayCol?: number;
    displayRow?: number;
    displaySection?: string;
    fieldSeq?: number;
    fieldType?: number;
    filterField?: string;
    filterKey?: string;
    filterOp?: string;
    filterVal?: string;
    groupLevel?: number;
    helpText?: string;
    columnName?: string;
    hint?: string;
    isIndex?: boolean;
    indexValue?: string;
    isRequired?: boolean;
    schema?: string;
    isUnique?: boolean;
    isVisible?: number;
    numPrecision?: number;
    numScale?: number;
    onBlur?: string;
    onChange?: string;
    optionLabels?: string;
    optionValues?: string;
    optionMapLabel?: any;
    refRecordTypeFields?: string;
    relateRecordBack?: string;
    relateRecordTypeId?: string;
    relateRecordTypeName?: string;
    scriptStat?: string;
    scriptTable?: string;
    txtLength?: number;
    unity?: string;
    visibleLines?: number;
    visibleWidth?: number;

    constructor(data?: Partial<RecordTypeField>) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
}