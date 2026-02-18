import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {appProperties} from "../../app.properties";
import {DocumentCriteria, DocumentData} from "../models/document.model";

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/v1/document`;
    constructor(private http: HttpClient) {
    }

    search(payload : DocumentCriteria): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/search`, payload);
    }

    submit(payload: any): Observable<any> {
        // ส่ง POST แบบปกติ ได้รับ Response กลับมาเป็น Body เลย
        return this.http.post<any>(`${this.API_URL}/submit`, payload);
    }

}
