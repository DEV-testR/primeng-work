export interface OrgChartNode {
    id: string;
    code: string;
    name: string;
    positionName: string;
    departmentName: string;
    imageUrl?: string; // <--- เพิ่มตัวนี้ (ใส่ ? ไว้เผื่อบางคนไม่มีรูป)
    startDate?: string; // เพิ่มไว้รองรับข้อมูลในรูปที่พี่ส่งมา
    tenure?: string;    // เพิ่มไว้รองรับข้อมูลในรูปที่พี่ส่งมา
    managerId: string | null;
    roles: string[];
    children: OrgChartNode[];
}