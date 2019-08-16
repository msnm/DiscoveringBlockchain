import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DepartmentListComponent } from './departments/department-list/department-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DepartmentComponent } from './departments/department/department.component';
import { DepartmentThumbnailComponent } from './departments/department-list/department-thumbnail/department-thumbnail.component';
import { RoomComponent } from './departments/department/room/room.component';
import { PatientComponent } from './patients/patient/patient.component';
import { PatientThumbnailComponent } from './patients/patient/patient-thumbnail/patient-thumbnail.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TreatmentComponent } from './patients/patient/treatment/treatment.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SearchModalComponent } from './shared/modal/search-modal/search-modal.component';
import {EthereumModule} from "./ethereum/ethereum.module";

@NgModule({
  declarations: [
    AppComponent,
    DepartmentListComponent,
    NavBarComponent,
    DepartmentComponent,
    DepartmentThumbnailComponent,
    RoomComponent,
    PatientComponent,
    PatientThumbnailComponent,
    TreatmentComponent,
    SettingsComponent,
    SearchModalComponent,
  ],
  imports: [
    BrowserModule,
    EthereumModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
