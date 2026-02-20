import { Routes } from '@angular/router';
import {DocumentComponent} from "./document.component";
import {DocumentFormComponent} from "./component/document-form/document.form.component";
import {DocumentFlowComponent} from "./component/document-flow/document.flow.component";

export default [
    {
        path: '',
        component: DocumentComponent,
        data: { breadcrumb: 'Documents' }
    },
    {
        path: 'form',
        component: DocumentFormComponent,
        data: { breadcrumb: 'Form' }
    },
    {
        path: 'flow',
        component: DocumentFlowComponent,
        data: { breadcrumb: 'Flow' }
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
