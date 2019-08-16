import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DepartmentComponent} from './departments/department/department.component';
import {DepartmentListComponent} from './departments/department-list/department-list.component';
import {PatientComponent} from './patients/patient/patient.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  { path: 'departments/:departmentId', component: DepartmentComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'patients/:patientId', component: PatientComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/departments', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
