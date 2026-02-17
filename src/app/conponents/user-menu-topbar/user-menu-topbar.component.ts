import {Component, OnInit, ViewChild} from "@angular/core";
import {Ripple} from "primeng/ripple";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Popover} from "primeng/popover";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'user-menu-topbar',
    imports: [
        Ripple,
        Popover,
        NgOptimizedImage,
    ],
    templateUrl: './user-menu-topbar.component.html',
    styleUrls: ['./user-menu-topbar.component.scss'],
})

export class UserMenuTopbar implements OnInit {
    user : User | undefined;
    constructor(private router: Router, private userService : UserService,private authService : AuthService ) {}
    @ViewChild('op') op!: Popover;

    ngOnInit() {
        this.user = this.userService.getUser();
    }

    ngLogoutClick() {
        this.authService.logout().subscribe(() => this.router.navigate(['/']).then())
    }

    toggle($event: any) {
        this.op.toggle($event);
    }
}