import { User } from './user.model';
import { HealthRecord } from './health-record.model';
import { Inbox } from './inbox.model';

export interface Pet {
    id: number;
    name: string;
    species: string;            // เช่น สุนัข, แมว
    breed?: string;
    age?: number;
    profilePictureUrl?: string;

    owner?: User;               // owner เป็น optional เพื่อป้องกัน circular reference
    healthRecords?: HealthRecord[];
    inboxes?: Inbox[];
}
