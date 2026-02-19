import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OrgChartNode} from "../models/orgchartNode.model";
import {appProperties} from "../../app.properties";

// org-chart.service.ts
@Injectable({ providedIn: 'root' })
export class OrgChartService {
    private readonly API_URL = `${appProperties.BASE_API_URL}/api/v1/org-chart`;
    constructor(private http: HttpClient) {}

    // ดึงเฉพาะ Root Nodes (CEO หรือหัวหน้าสูงสุด)
    getRoots(): Observable<OrgChartNode[]> {
        return this.http.get<OrgChartNode[]>(`${this.API_URL}/roots`);
    }

    // ดึงลูกน้องของพนักงานคนนั้นๆ (สำหรับ Lazy Loading)
    getChildren(managerId: number): Observable<OrgChartNode[]> {
        return this.http.get<OrgChartNode[]>(`${this.API_URL}/children/${managerId}`);
    }

    moveEmployee(employeeId: string, newManagerId: string) {
        return this.http.post(`${this.API_URL}/move`,
            { employeeId, newManagerId },
            { responseType: 'text' } // <--- เพิ่มบรรทัดนี้ครับ
        );
    }

    unassignEmployee(employeeId: string): Observable<any> {
        return this.http.post(`${this.API_URL}/unassign/${employeeId}`, {}, { responseType: 'text' });
    }

    getUnassignedEmployees(): Observable<OrgChartNode[]> {
        return this.http.get<OrgChartNode[]>(`${this.API_URL}/unassigned`);
    }
}