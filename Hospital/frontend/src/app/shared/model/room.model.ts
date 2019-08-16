import {Bed} from './bed.model';

export class Room {
  roomNumber: number;
  length: number;
  width: number;
  toilet: boolean;
  shower: boolean;
  bath: boolean;
  saloon: boolean;
  baby: boolean;
  beds: Bed[];
}
