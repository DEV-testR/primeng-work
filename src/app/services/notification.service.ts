import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {appProperties} from "../../app.properties";
import {AuthService} from "./auth.service";
import { EventSourcePolyfill } from 'event-source-polyfill';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly API_URL = `${environment.BASE_API_URL}/api/v1/notifications`;
    constructor(
        private http: HttpClient,
        private zone: NgZone,
        private authService: AuthService // 2. Inject เข้ามาใน Constructor
    ) {}

    getNotificationStream(userId: string): Observable<any> {
        return new Observable(observer => {
            let eventSource: EventSourcePolyfill;

            const connect = () => {
                const token = this.authService.getAccessToken();

                eventSource = new EventSourcePolyfill(
                    `${this.API_URL}/stream/${userId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` },
                        heartbeatTimeout: 300000 // 5 นาที
                    }
                );

                eventSource.onmessage = (event : any) => {
                    this.zone.run(() => observer.next(JSON.parse(event.data)));
                };

                eventSource.onerror = (error: any) => {
                    this.zone.run(() => {
                        console.error('SSE Error:', error);
                        eventSource.close();

                        // ถ้าเจอ 401 (Unauthorized) ให้พยายามรีเฟรช Token และเชื่อมต่อใหม่
                        if (error.status === 401) {
                            console.log('Token expired, attempting to reconnect SSE...');
                            setTimeout(() => connect(), 1000);
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
