import {Injectable} from '@angular/core';
import {Department} from '../model/department.model';
import {Room} from '../model/room.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentApiService {

  private rooms: Room[] = [
    {
      roomNumber: 1,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: true,
      bath: false,
      saloon: false,
      baby: false,
      beds: [ { id: 1, patientId: 10001}, { id: 2, patientId: 10002 } ]
   },
    {
      roomNumber: 2,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: false,
      beds: [ { id: 3, patientId: 10002 }, { id: 4, patientId: 10003 } ]
    },
    {
      roomNumber: 3,
      width: 3.5,
      length: 7,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: true,
      beds: []
    },
    {
      roomNumber: 4,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: true,
      bath: false,
      saloon: false,
      baby: false,
      beds: [ { id: 6, patientId: 10005 }, { id: 7, patientId: 10006 } ]
    },
    {
      roomNumber: 5,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: false,
      beds: [ { id: 8, patientId: 10007 }, { id: 9, patientId: 10008 } ]
    },
    {
      roomNumber: 6,
      width: 3.5,
      length: 7,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: true,
      beds: [ { id: 10, patientId: 10009 } ]
    }, {
      roomNumber: 7,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: true,
      bath: false,
      saloon: false,
      baby: false,
      beds: [ { id: 11, patientId: 10010 }, { id: 12, patientId: 10011 } ]
    },
    {
      roomNumber: 8,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: false,
      beds: [ { id: 13, patientId: 10012 }, { id: 14, patientId: 10013 } ]
    },
    {
      roomNumber: 9,
      width: 3.5,
      length: 7,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: true,
      beds: [ { id: 15, patientId: 10014 } ]
    }, {
      roomNumber: 10,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: true,
      bath: false,
      saloon: false,
      baby: false,
      beds: [ { id: 16, patientId: 10015 }, { id: 17, patientId: 10016 } ]
    },
    {
      roomNumber: 11,
      width: 3.5,
      length: 5,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: false,
      beds: [ { id: 18, patientId: 10017 }, { id: 19, patientId: 10018 } ]
    },
    {
      roomNumber: 12,
      width: 3.5,
      length: 7,
      toilet: true,
      shower: false,
      bath: true,
      saloon: true,
      baby: true,
      beds: [ { id: 20, patientId: 10019 }, { id: 21, patientId: 10020 }, { id: 22, patientId: 10021 } ]
    },
  ];

  private departments: Department[] = [
    {
      id: 1,
      code: 'MTN',
      name: 'Materniteit',
      imgUrl: '/assets/images/materniteit.jpg',
      rooms: this.rooms
    },
    {
      id: 2,
      code: 'KND',
      name: 'Kinderafdeling',
      imgUrl: '/assets/images/kinderafdeling.jpg',
      rooms: this.rooms

    },
    {
      id: 3,
      code: 'PLZ',
      name: 'Palliatieve zorg',
      imgUrl: '/assets/images/palliatieve.jpg',
      rooms: this.rooms
    },
    {
      id: 4,
      code: 'ITZ',
      name: 'Intensieve zorg',
      imgUrl: '/assets/images/intensieve.jpg',
      rooms: this.rooms
    },
    {
      id: 5,
      code: 'CCU',
      name: 'Beroertezorg',
      imgUrl: '/assets/images/beroertezorg.jpg',
      rooms: this.rooms
    },
    {
      id: 6,
      code: 'GRT',
      name: 'Geriatrie',
      imgUrl: '/assets/images/geriatrie.jpg',
      rooms: this.rooms
    },
  ];

  private departmentUrl = 'http://localhost:3000/api/departments';

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.departmentUrl);
  }

  getDepartment(id: number): Observable<Department>  {
    const url = `${this.departmentUrl}/${id}`;
    return this.http.get<Department>(url);
  }

  getRooms(departmentId: number): Room[] {
    return this.departments[departmentId - 1].rooms;
  }

  findRoomOfPatient(patientId: number): Room {
    return this.rooms.find(room => room.beds.find(bed => bed.patientId === patientId) !== undefined);
  }

  findDepartmentOfPatient(patientId: number): Observable<Department> {
    const url = `${this.departmentUrl}/patient/${patientId}`;
    return this.http.get<Department>(url);
  }


}
