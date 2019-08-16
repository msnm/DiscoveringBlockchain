import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Patient, Treatment} from '../../../shared/model/patient.model';
import {SettingService} from '../../../shared/services/setting.service';

@Component({
  selector: 'app-patient-thumbnail',
  templateUrl: './patient-thumbnail.component.html',
  styleUrls: ['./patient-thumbnail.component.css']
})

export class PatientThumbnailComponent implements OnChanges, OnInit {

  @Input() patient: Patient;
  isCollapsedPatient;
  isCollapsedTreatment;

  nextTreatment: Treatment;

  constructor(private settingsService: SettingService) {
  }

  ngOnInit() {
    this.isCollapsedPatient = false;
    this.isCollapsedTreatment = false;
  }

  onClick() {
    const todos = this.patient.treatments.filter(t => t.status === 'ToDo').sort((a, b) => new Date(a.dateOfTreatment).getTime() >= new Date(b.dateOfTreatment).getTime() ? -1 : 1);
    if (todos && todos.length > 0) {
      this.nextTreatment = todos[0];
    }
  }



  ngOnChanges(changes: SimpleChanges): void {
      this.onClick();
  }
}
