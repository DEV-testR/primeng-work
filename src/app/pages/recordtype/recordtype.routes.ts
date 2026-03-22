import {Routes} from "@angular/router";
import {RecordTypeComponent} from "./recordtype.component";
import {RecordTypeFormComponent} from "./component/recordtype-form/recordtype.form.component";

export default [
    {
        path: 'form/:formName/:itemName/:itemId',
        component: RecordTypeFormComponent,
        data: { breadcrumb: 'RecordType Form' }
    },
    {
        path: ':name',
        component: RecordTypeComponent,
        data: { breadcrumb: 'RecordType' }
    },
    {
        path: '',
        component: RecordTypeComponent,
        pathMatch: 'full',
        data: { breadcrumb: 'RecordType' }
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
] as Routes;