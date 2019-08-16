import {Injectable} from '@angular/core';
import {Food, HospitalizationInfo, Patient, Treatment, TreatmentType} from '../model/patient.model';
import {DepartmentApiService} from './department-api.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../model/department.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientApiService {

  private hospitalization1: HospitalizationInfo = {
    id: 100202,
    admission: new Date(),
    reason: 'Open dubbele beenbreuk',
    plannedResignation: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 4))
  };

  private hospitalization2: HospitalizationInfo = {
    id: 100203,
    admission: new Date(),
    reason: 'Hartaandoening linker hartklep',
    plannedResignation: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 3))
  };

  private hospitalization3: HospitalizationInfo = {
    id: 100204,
    admission: new Date(),
    reason: 'Chemotherpaie',
    plannedResignation: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7))
  };

  private treatments: Treatment[] = [
    {
      id: 20001,
      type: TreatmentType.FEEDING,
      dateOfTreatment: new Date(),
      description: 'Helpen met eten geven'
    },
    {
      id: 20002,
      type: TreatmentType.WASHING,
      dateOfTreatment: new Date(),
      description: 'Douhcen'
    },
    {
      id: 20003,
      type: TreatmentType.WOUND_CARE,
      dateOfTreatment: new Date(),
      description: 'Verbanden verversen'
    }
  ];
  private patients: Patient[] = [
    {
      id: 10001,
      firstName: 'Michael',
      lastName: 'Schoenmaekers',
      birthDate: new Date(1994, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1
    },
    {
      id: 10002,
      firstName: 'Quirine',
      lastName: 'Peeters',
      birthDate: new Date(1995, 3, 30),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2
    },
    {
      id: 10003,
      firstName: 'Marc',
      lastName: 'Schoenmaekers',
      birthDate: new Date(1956, 2, 5),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10004,
      firstName: 'Daan',
      lastName: 'VanHille',
      birthDate: new Date(1980, 4, 2),
      sex: 'F',
      food: Food.VEGAN,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1

    }, {
      id: 10005,
      firstName: 'Jos',
      lastName: 'Vunckx',
      birthDate: new Date(1939, 12, 10),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2

    }, {
      id: 10006,
      firstName: 'Miet',
      lastName: 'Goossens',
      birthDate: new Date(1991, 2, 16),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10007,
      firstName: 'Jules',
      lastName: 'De Backer',
      birthDate: new Date(1970, 8, 19),
      sex: 'M',
      food: Food.VEGAN,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1

    }, {
      id: 10008,
      firstName: 'Len',
      lastName: 'De Wolf',
      birthDate: new Date(1994, 9, 4),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2

    }, {
      id: 10009,
      firstName: 'Kim',
      lastName: 'Van Roy',
      birthDate: new Date(1970, 1, 2),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10010,
      firstName: 'Karine',
      lastName: 'Delaruelle',
      birthDate: new Date(1977, 9, 2),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1

    }, {
      id: 10011,
      firstName: 'Alizeé',
      lastName: 'Van hille',
      birthDate: new Date(2006, 10, 9),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2

    }, {
      id: 10012,
      firstName: 'Steven',
      lastName: 'Schoenmaekers',
      birthDate: new Date(1980, 4, 3),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10013,
      firstName: 'Pascal',
      lastName: 'Janssens',
      birthDate: new Date(1975, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1

    }, {
      id: 10014,
      firstName: 'Els',
      lastName: 'Van Houte',
      birthDate: new Date( 1970, 1, 2),
      sex: 'F',
      food: Food.VEGETARIAN,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2

    }, {
      id: 10015,
      firstName: 'Adriaan',
      lastName: 'Lemmekens',
      birthDate: new Date(2002, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10016,
      firstName: 'Charlotte',
      lastName: 'Peers',
      birthDate: new Date(1994, 1, 2),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10017,
      firstName: 'Paul',
      lastName: 'Pijl',
      birthDate: new Date(1994, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1

    }, {
      id: 10018,
      firstName: 'Marga',
      lastName: 'Schoenmaekers',
      birthDate: new Date(1952, 1, 2),
      sex: 'F',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2

    }, {
      id: 10019,
      firstName: 'Jules',
      lastName: 'De Strooper',
      birthDate: new Date(1964, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3

    }, {
      id: 10020,
      firstName: 'Thijs',
      lastName: 'De Bouwer',
      birthDate: new Date(1994, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization1

    }, {
      id: 10021,
      firstName: 'Ellen',
      lastName: 'Schoenmaekers',
      birthDate: new Date(1998, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization2

    }, {
      id: 10022,
      firstName: 'Rosalie',
      lastName: 'Weyers',
      birthDate: new Date(1999, 1, 2),
      sex: 'M',
      food: Food.CARNIVORE,
      treatments: this.treatments,
      hospitalizationInfo: this.hospitalization3
    }
  ];

  private patientUrl = 'http://localhost:3000/api/patients';

  constructor(private http: HttpClient) { }

  getPatient(id: number): Observable<Patient> {
    const url = `${this.patientUrl}/${id}`;
    return this.http.get<Patient>(url);
  }

  updateTreatment(patient: Patient): Observable<Patient> {
    const url = `${this.patientUrl}/${patient.id}`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.patch<Patient>(url, patient, { headers });
  }

  addTreatment(patient: Patient): Observable<Patient> {
    const url = `${this.patientUrl}/${patient.id}`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Patient>(url, patient, { headers });
  }

  deleteTreatment(patient: Patient): Observable<Patient> {
    const url = `${this.patientUrl}/${patient.id}`;
    return this.http.delete<Patient>(url);
  }
}
