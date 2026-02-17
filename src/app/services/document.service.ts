import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {appProperties} from "../../app.properties";
import {DocumentCriteria, DocumentData} from "../models/document.model";

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/document`;
    constructor(private http: HttpClient) {
    }

    search(formData : DocumentCriteria): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/search`);
    }

}
