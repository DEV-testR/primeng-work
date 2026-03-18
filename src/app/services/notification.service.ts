import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {EventSourcePolyfill} from 'event-source-polyfill';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly API_URL = `${environment.BASE_API_URL}/api/v1/notifications`;
    private readonly MAX_RETRIES = 2;
    constructor(
        private http: HttpClient,
        private zone: NgZone,
        private authService: AuthService
    ) {}

    getNotificationStream(userId: string): Observable<any> {
        return new Observable(observer => {
            let eventSource: EventSourcePolyfill;
            let retryCount = 0;

            const connect = () => {
                const token = this.authService.getAccessToken();
                if (!token) {
                    return;
                }

                eventSource = new EventSourcePolyfill(
                    `${this.API_URL}/stream/${userId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` },
                        heartbeatTimeout: 300000 // 5 นาที
                    }
                );

                eventSource.onmessage = (event : any) => {
                    retryCount = 0;
                    this.zone.run(() => observer.next(JSON.parse(event.data)));
                };

                eventSource.onerror = (error: any) => {
                    this.zone.run(() => {
                        console.error(`SSE Error (Attempt ${retryCount + 1}):`, error);
                        eventSource.close();
                        if (error.status === 401) {
                            if (retryCount < this.MAX_RETRIES) {
                                retryCount++;
                                console.log(`Retrying SSE connection in 2 seconds... (${retryCount}/${this.MAX_RETRIES})`);
                                console.log('Token expired, attempting to reconnect SSE...');
                                setTimeout(() => connect(), 1000);
                            } else {
                                this.authService.removeAccessToken();
                                console.error('Max SSE retries reached. Stopping reconnection.');
                                observer.error('Failed to connect to notification stream after multiple attempts.');
                            }
                        } else {
                            observer.error(error);
                        }
                    });
                };
            };

            connect();
            return () => {
                if (eventSource) {
                    eventSource.close();
                }
            };
        });
    }

    getHistory(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/history/${userId}`);
    }

    getUnreadCount(userId: string): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/unread-count/${userId}`);
    }

    markAllAsRead(userId: string): Observable<void> {
        return this.http.patch<void>(`${this.API_URL}/read-all/${userId}`, {});
    }

    markAsRead(id: string): Observable<void> {
        return this.http.patch<void>(`${this.API_URL}/read/${id}`, {});
    }

}
