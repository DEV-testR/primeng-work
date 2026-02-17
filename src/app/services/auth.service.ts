import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthResponse} from "../models/authResponse.model";
import {LoginRequest} from "../models/loginRequest.model";
import {RegisterRequest} from "../models/registerRequest.model";
import {User} from "../models/user.model";
import {appProperties} from "../../app.properties";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/auth`;
    private readonly TOKEN_KEY = 'access_token';
    // private accessToken: string | null = null;

    constructor(private http: HttpClient) {
    }

    login(form: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.API_URL}/login`,
            form,
            {withCredentials: true} // เพื่อส่ง/รับ HttpOnly cookie
        ).pipe(
            tap(res => this.setAccessToken(res.accessToken))
        );
    }

    register(form: RegisterRequest): Observable<User>  {
        return this.http.post<User>(`${this.API_URL}/register`,form);
    }

    refreshToken(): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.API_URL}/refresh`,
            {},
            {withCredentials: true}
        ).pipe(
            tap(res => {
                this.setAccessToken(res.accessToken)
            })
        );
    }

    getAccessToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    setAccessToken(token: string): void {
        sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    removeAccessToken(): void {
        sessionStorage.removeItem(this.TOKEN_KEY);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/logout`, {}, {withCredentials: true})
            .pipe(tap(() => this.removeAccessToken()));
    }

}
