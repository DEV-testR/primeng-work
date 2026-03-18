
import {Routes} from "@angular/router";
import {RecordTypeComponent} from "./recordtype.component";

export default [
    {
        path: '',
        component: RecordTypeComponent,
        data: { breadcrumb: 'RecordType' }
    },
    {
        path: ':name',
        component: RecordTypeComponent,
        data: { breadcrumb: 'RecordType' }
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;