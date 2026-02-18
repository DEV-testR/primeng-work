import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {appProperties} from "../../app.properties";
import {LookupResponse} from "../models/lookupResponse.model";

@Injectable({
    providedIn: 'root',
})
export class LookupService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/v1/lookup`;
    constructor(private http: HttpClient) {
    }

    fetchDataLookup(clazzLookup: string): Observable<LookupResponse[]> {
        return this.http.get<LookupResponse[]>(`${this.API_URL}/fetchData/${clazzLookup}`);
    }

}
