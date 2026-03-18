
export interface RecordType extends GenericPersistentObject {
    id: string;
    className?: string;
    customActions?: string;
    customFrom?: string;
    customGroup?: string;
    customOrder?: string;
    customQueryType?: QueryType; // Enum หรือ Type ที่นิยามไว้
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
    inactive: boolean;
    custom: boolean;
    schemaField: boolean;
    tableName?: string;
    indexField?: string;
    label: string;
    licType?: string;
    loadOnInit: boolean;
    menuOrder?: number;
    name: string;
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
    prop?: string;
    refRecordType?: string;
    remarks?: string;
    reportFilename?: string;
    scripts?: string;
    scriptStat?: string;
    serviceClass?: string;
    tab?: string;
    unity?: string;
    valstr?: string;
    recordtypeFields: RecordTypeField[];
}

export interface GenericPersistentObject {
    createdBy?: string;
    createdDate?: Date | string | number;
    updatedBy?: string;
    updatedDate?: Date | string | number;
}

export interface RecordTypeField extends GenericPersistentObject {
    id: string; // ใช้ string เพื่อรองรับ Long จาก Java (กันเลขเพี้ยน)

    col?: string;
    dataType?: string;
    defaultPattern?: string;
    defaultValue?: string;
    description?: string;

    displayCol?: number;
    displayRow?: number;
    displaySection?: string;
    displaySeq?: number;

    fieldSeq?: number;
    fieldType?: number;

    advFilterEn?: boolean;
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
    isSearchRequired?: boolean;

    isVisible?: number;
    label?: string;
    name?: string;
    namespace?: string;

    numPrecision?: number;
    numScale?: number;

    onBlur?: string;
    onChange?: string;

    optionLabels?: string;
    optionValues?: string;

    prop?: CustomProperty;
    optionMapLabel?: OptionMapLabel;

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
}

export interface CustomProperty {
    [key: string]: any;
}

export interface OptionMapLabel {
    [value: string]: string;
}

export type QueryType = 'SQL' | 'HQL' | 'NATIVE' | string;