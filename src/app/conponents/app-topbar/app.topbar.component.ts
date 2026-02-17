import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {StyleClassModule} from 'primeng/styleclass';
import {LayoutService} from '../../layout/service/layout.service';
import {UserMenuTopbar} from "../user-menu-topbar/user-menu-topbar.component";
import {BadgeModule} from 'primeng/badge';
import {OverlayBadgeModule} from "primeng/overlaybadge";
import {AppConfigurator} from "../../layout/component/app.configurator";
import {NotiInboxTopbar} from "../noti-inbox-topbar/noti-inbox-topbar.component";
import {appProperties} from "../../../app.properties";

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule,
        CommonModule,
        StyleClassModule,
        UserMenuTopbar,
        BadgeModule,
        OverlayBadgeModule, AppConfigurator, NotiInboxTopbar],
    templateUrl: `./app-topbar.component.html`
})
export class AppTopbar {
    protected readonly appProperties = appProperties;
    items!: MenuItem[];

    constructor(public layoutService: LayoutService,
                public router: Router) {
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({...state, darkTheme: !state.darkTheme}));
    }

}
