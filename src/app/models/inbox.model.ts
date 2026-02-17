import { Pet } from './pet.model';

export interface Inbox {
    id: number;
    message: string;
    timestamp: string;

    pet?: Pet;
}
