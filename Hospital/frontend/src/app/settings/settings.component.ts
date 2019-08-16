import { Component, OnInit } from '@angular/core';
import {SettingService} from '../shared/services/setting.service';
import {Setting} from '../shared/model/setting.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: Setting;
  changeSettings = false;
  settingsForm: FormGroup;





  constructor(private fb: FormBuilder, private settingService: SettingService, private router: Router) { }

  ngOnInit() {
    this.settings = this.settingService.setting;
    this.settingsForm = this.fb.group({
      roomNumber: [this.settings.roomNumber, Validators.required],
      namePatient: [this.settings.namePatient, Validators.required],
      treatmentType: [this.settings.treatmentType, Validators.required],
      interval: [this.settings.interval, Validators.required],
      icons: [this.settings.roomNumber, Validators.required],
      colorOK: [this.settings.roomNumber, Validators.required],
      colorERROR: [this.settings.roomNumber, Validators.required],
    });
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      this.settings = {...this.settings, ...this.settingsForm.value};
      this.settingService.updateSetting(this.settings);
      this.settingsForm.reset();
      this.router.navigate(['departments']);
    }
  }

  cancelSettings() {
    this.router.navigate(['departments']);
  }

  toggleForm() {
    this.changeSettings = !this.changeSettings;
    if (this.changeSettings) {
      this.settingsForm.enable();
    } else {
      this.settingsForm.reset();
    }
  }
}
