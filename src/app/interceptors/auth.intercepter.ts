import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {BehaviorSubject, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);
export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const accessToken = authService.getAccessToken();
    let authReq = req;
    const isRefreshTokenRequest : boolean = req.url.includes('/refresh');
    if (accessToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    return next(authReq).pipe(
        catchError(err => {
            if (err.status === 401 && isRefreshTokenRequest) {
                isRefreshing = false;
                refreshTokenSubject.next(null);
                authService.logout();
                router.navigate(['/login']).then(() => throwError(() => err));
            }

            if (err instanceof HttpErrorResponse && err.status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenSubject.next(null);
                    authService.removeAccessToken();
                    return authService.refreshToken().pipe(
                        switchMap(() => {
                            isRefreshing = false;
                            const newAccessToken = authService.getAccessToken();
                            if (newAccessToken) {
                                refreshTokenSubject.next(newAccessToken);
                                const newReq = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${newAccessToken}`
                                    }
                                });
                                return next(newReq);
                            }
                            authService.logout();
                            return throwError(() => err);
                        }),
                        catchError(error => {
                            isRefreshing = false;
                            refreshTokenSubject.error(error);
                            authService.logout();
                            return throwError(() => new Error('Session expired, please login again.'));
                        })
                    );
                }
                else {
                    return refreshTokenSubject.pipe(
                        filter(token => token != null),
                        take(1),
                        switchMap(token => {
                            const newReq = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token!}`
                                }
                            });
                            return next(newReq);
                        })
                    );
                }
            }

            return throwError(() => err);
        })
    );
};
