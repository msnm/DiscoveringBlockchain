import {Room} from './room.model';

export class Department {
  id: number;
  code: string;
  name: string;
  imgUrl: string;
  rooms: Room[];
}
