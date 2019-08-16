import {Injectable} from '@angular/core';
import {Setting} from '../model/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  setting: Setting;

  constructor() {
    this.setting = {
      roomNumber: true,
      namePatient: true,
      treatmentType: true,
      interval: 30,
      icons: true,
      colorOK: 'GREEN',
      colorERROR: 'RED'
    };
  }

  getSetting(): Setting {
    return this.setting;
  }

  updateSetting(setting: Setting): void {
    this.setting = setting;
  }
}
