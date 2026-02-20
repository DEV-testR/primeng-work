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

    delete(id : String): Observable<any> {
        return this.http.delete(`${this.API_URL}/delete/${id}`);
    }

    save(payload: any): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/save`, payload);
    }

    generateFlow(payload: any): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/generate-flow`, payload);
    }

}
