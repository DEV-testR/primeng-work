import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from "../models/user.model";
import {appProperties} from "../../app.properties";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/v1/users`;
    private readonly userDataKey = 'userData';
    constructor(private http: HttpClient) {
    }

    fetchUser(): Observable<User> {
        return this.http.get<User>(`${this.API_URL}/me`);
    }

    setUser(userData : User | null) : void {
        if (!userData) {
            return;
        }

        localStorage.setItem(this.userDataKey, JSON.stringify(userData));
    }

    getUser(): User {
        let item: string | null = localStorage.getItem(this.userDataKey);
        if (!item) {
            this.fetchUser().subscribe((userData) => {
                this.setUser(userData);
                return userData;
            })
        }

        return JSON.parse(<string>item);
    }

}
