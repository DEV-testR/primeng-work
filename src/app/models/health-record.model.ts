import { Pet } from './pet.model';

export interface HealthRecord {
    id: number;
    description: string;
    date: string;

    pet?: Pet; // ใช้ optional เพื่อเลี่ยง circular reference
}
