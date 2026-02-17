import { Component, OnInit } from '@angular/core';
import {PrimeTemplate} from "primeng/api";
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {Card} from "primeng/card";
import {Textarea} from "primeng/textarea";

interface UserProfile {
    name: string;
    email: string;
    bio: string;
    joinDate: Date;
    profilePicUrl: string;
}

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    imports: [
        PrimeTemplate,
        Button,
        FormsModule,
        InputText,
        NgIf,
        DatePipe,
        Card,
        Textarea,
        NgOptimizedImage,
    ],
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    user: UserProfile = {
        name: 'Prime User',
        email: 'prime.user@example.com',
        bio: 'Front-end enthusiast building beautiful UIs with Angular and PrimeNG.',
        joinDate: new Date('2024-03-01'),
        profilePicUrl: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'
    };

    isEditing: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // โหลดข้อมูล user
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
    }

    saveProfile(): void {
        // โค้ดสำหรับบันทึกข้อมูลที่แก้ไขไปยัง backend
        console.log('Profile saved:', this.user);
        // แสดงข้อความแจ้งเตือน (อาจใช้ PrimeNG Message/Toast)
        this.toggleEdit();
    }
}