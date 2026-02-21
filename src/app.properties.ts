export interface GlobalConfig {
    rootPath: string;
    production: boolean;
    appName: string;
    appTitle: string;
    BASE_API_URL: string;
    defaultPageSize: number;
    dateFormat: string;
    dateTimeFormat: string;
    inputDateFormat: string;
}

export const appProperties: GlobalConfig = {
    BASE_API_URL: 'http://localhost:48080',
    inputDateFormat:'dd/mm/yy',
    dateFormat:'dd/MM/yyyy',
    dateTimeFormat:'dd/MM/yyyy HH:mm',
    rootPath: 'sakai',
    production: false,
    defaultPageSize: 0,
    appName: 'Sakai Platform',
    appTitle: 'Sakai Platform'
};
