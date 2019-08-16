import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StatusTreatment, Treatment, TreatmentType} from '../../../shared/model/patient.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.css']
})
export class TreatmentComponent implements OnInit {

  @Input() treatment: Treatment;
  @Input() newTreatment = false;
  @Output() treatmentChanged = new EventEmitter<Treatment>();

  treatmentForm: FormGroup;
  treatmentTypes: string[] = [];
  statusTypes: string[] = [];
  openForm = false;
  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.valueOfTreatmentType();
    this.valueOfStatusType();
    if (this.newTreatment) {
      console.log('New Treatment');
      this.treatmentForm = this.fb.group({
        type: [TreatmentType.FEEDING],
        dateOfTreatment: this.fb.group({
          date: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
          time: [this.datePipe.transform(new Date(), 'hh:mm')]
        }),
        description: ['', Validators.required],
        status: [StatusTreatment.TODO.valueOf()]
      });
      this.openForm = true;
    } else {
      this.treatmentForm = this.fb.group({
        type: [this.treatment.type],
        dateOfTreatment: this.fb.group({
          date: [this.datePipe.transform(this.treatment.dateOfTreatment, 'yyyy-MM-dd')],
          time: [this.datePipe.transform(this.treatment.dateOfTreatment, 'hh:mm')]
        }),
        description: [this.treatment.description, Validators.required],
        status: [this.treatment.status.valueOf()]
      });
    }
  }

  saveTreatment() {
    if (this.treatmentForm.valid) {
        const t = { ...this.treatment, ...this.treatmentForm.value };
        const date: Date = new Date(t.dateOfTreatment.date);
        const hour: number = +t.dateOfTreatment.time.toString().substr(0, 2);
        const min: number = +t.dateOfTreatment.time.toString().substr(3);
        t.dateOfTreatment = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min);
        this.treatmentChanged.emit(t);
    }
    this.treatmentForm.reset();
    this.treatmentForm.disable();
  }

  cancelTreatment() {
    if (this.newTreatment) {
      this.treatmentChanged.emit();
    }
    this.toggleForm();
  }

  deleteTreatment() {
    console.log('Deleted');
    this.toggleForm();
  }

  valueOfTreatmentType() {
    for (const value of Object.keys(TreatmentType)) {
      this.treatmentTypes.push(TreatmentType[value]);
    }
  }

  valueOfStatusType() {
    for (const value of Object.keys(StatusTreatment)) {
      this.statusTypes.push(StatusTreatment[value]);
    }
  }


  toggleForm() {
    this.openForm = !this.openForm;
    if (this.openForm) {
      this.treatmentForm.enable();
    } else {
      this.treatmentForm.reset();
    }
  }
}
