import {Component, ViewChild} from "@angular/core";
import {OverlayBadge} from "primeng/overlaybadge";
import {Popover} from "primeng/popover";
import {NgFor} from '@angular/common';

@Component({
    selector: 'noti-inbox-topbar',
    imports: [
        OverlayBadge,
        Popover,
        NgFor,

    ],
    templateUrl: './noti-inbox-topbar.component.html',
    styleUrls: ['./noti-inbox-topbar.component.scss'],
})

export class NotiInboxTopbar {
    constructor() {}
    @ViewChild('op') op!: Popover;

    /*items = [
        { subject: 'SE', detail: 'SO-2411-0683', image: 'amyelsner.png', role: 'Owner' },
        { subject: 'ICORP', detail: 'SO-2411-0683', image: 'bernardodominic.png', email: 'SO-2411-0684', role: 'Editor' },
        { subject: 'DIAG', detail: 'SO-2411-0683', image: 'ionibowcher.png', email: 'SO-2411-0685', role: 'Viewer' },
    ];*/

    /*items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];*/


    items = [
        {
            date: '24 May 2025',
            detailList: [
                { subject : 'Richard Jones has purchased a blue t-shirt for $79.00' },
                { subject : 'Your request for withdrawal of $2500.00 has been initiated.' },
            ]
        },
        {
            date: '23 May 2025',
            detailList: [
                { subject : 'Geyser Wick has purchased a black jacket for $59.00' },
                { subject : 'Jane Davis has posted a new questions about your product.' },
            ]
        },
        {
            date: '22 May 2025',
            detailList: [
                { subject : 'Richard Jones has purchased a blue t-shirt for $79.00' },
                { subject : 'Your request for withdrawal of $2500.00 has been initiated.' },
            ]
        },
    ];

    toggle(event:any) {
        this.op.toggle(event);
    }

    selectMember(member:any) {
        this.op.hide();
    }
}