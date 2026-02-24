import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {appProperties} from "../../app.properties";
import {AuthService} from "./auth.service";
import { EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/v1/notifications`;
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

                // ส่งทั้ง Header และ Query Param เพื่อความชัวร์
                eventSource = new EventSourcePolyfill(
                    `${this.API_URL}/stream/${userId}?token=${token}`,
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
                            // รอสัก 1 วินาทีแล้วค่อยต่อใหม่เพื่อให้ AuthService จัดการ Token ใหม่เสร็จก่อน
                            setTimeout(() => connect(), 1000);
                        } else {
                            // ถ้าเป็น Error อื่นๆ ให้ส่ง Error ออกไป
                            observer.error(error);
                        }
                    });
                };
            };

            connect();

            // คืนค่าฟังก์ชันสำหรับปิดท่อเมื่อไม่ได้ใช้ Component แล้ว
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
