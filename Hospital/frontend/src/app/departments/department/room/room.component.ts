import {Component, Input, OnInit} from '@angular/core';
import {Room} from '../../../shared/model/room.model';
import {Patient} from '../../../shared/model/patient.model';
import {PatientApiService} from '../../../shared/services/patient-api.service';
import {SettingService} from '../../../shared/services/setting.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @Input() room: Room;
  patients: Patient[] = [];
  patientActive: Patient;
  roomStatus: string;

  constructor(private patientApi: PatientApiService, private settingsService: SettingService) {
  }

  ngOnInit() {
    this.room.beds.filter(bed => bed.patientId !== undefined).forEach(bed => this.getPatient(bed.patientId));
    this.checkStatusOfRoom();

  }

  getPatient(id: number) {
    this.patientApi.getPatient(id).subscribe(
      (patient: Patient) => {
        this.patients.push(patient);
        this.setPatientActive(this.patients[0]);
        this.checkStatusOfRoom();
      },
      (error => console.log(error))
    );
  }

  setPatientActive(patient: Patient) {
    this.patientActive = patient;
  }

  changeActivePatient(patient) {
    this.setPatientActive(patient);
  }

  checkStatusOfRoom() {
    if (this.patients && this.patients.length !== 0) {
      for (const patient of this.patients) {
        for (const treatment of patient.treatments) {
          if (treatment.status !== 'Done') {
            const now = new Date();
            const treatmentDate: Date = new Date(treatment.dateOfTreatment);
            const milliseconds = now.getTime() - treatmentDate.getTime();
            const hours = milliseconds / 1000 / 60 / 60;
            if (Math.abs(hours) <= 1) {
              this.roomStatus = 'treatment';
              this.patientActive = patient;
              return;
            }
          }
        }
      }
      this.roomStatus = 'ok';
    } else {
      this.roomStatus = 'empty';
    }
  }

}
