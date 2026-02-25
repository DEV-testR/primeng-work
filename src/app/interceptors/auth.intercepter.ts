import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {BehaviorSubject, filter, finalize, Observable, switchMap, take, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const accessToken = authService.getAccessToken();
    const isRefreshRequest = req.url.endsWith('/auth/refresh');

    const authReq = accessToken && !isRefreshRequest
        ? addToken(req, accessToken)
        : req;

    return next(authReq).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {

                if (isRefreshRequest) {
                    return logout(authService, router, error);
                }

                return handle401(authService, router, req, next, error);
            }

            return throwError(() => error);
        })
    );
};

function handle401(authService: AuthService, router: Router, req: HttpRequest<any>, next: HttpHandlerFn, originalError: any): Observable<HttpEvent<any>> {

    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap(() => {
                const newToken = authService.getAccessToken();

                if (!newToken) {
                    return logout(authService, router, originalError);
                }

                refreshTokenSubject.next(newToken);
                return next(addToken(req, newToken));
            }),
            catchError(err => logout(authService, router, err)),
            finalize(() => {
                isRefreshing = false;
            })
        );
    }

    return refreshTokenSubject.pipe(
        filter((token): token is string => !!token),
        take(1),
        switchMap(token => next(addToken(req, token)))
    );
}

function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
}

function logout(authService: AuthService, router: Router, error: any): Observable<any> {
    isRefreshing = false;
    authService.logout();
    void router.navigate(['/login']);
    return throwError(() => error);
}
