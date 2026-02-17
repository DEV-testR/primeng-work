import { Routes } from '@angular/router';
import {DocumentComponent} from "./document.component";
import {DocumentFormComponent} from "./document.form.component";

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
    { path: '**', redirectTo: '/notfound' }
] as Routes;
