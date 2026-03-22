import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DocumentCriteria} from "../models/document.model";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    private readonly API_URL = `${environment.BASE_API_URL}/api/v1/document`;
    constructor(private http: HttpClient) {
    }

    search(payload : DocumentCriteria): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/search`, payload);
    }

    searchById(id : String): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/search/${id}`);
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

    submitFlow(payload: any): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/submit-flow`, payload);
    }

}
