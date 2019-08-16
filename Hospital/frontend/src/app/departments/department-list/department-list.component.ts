import { Component, OnInit } from '@angular/core';
import {Department} from '../../shared/model/department.model';
import {DepartmentApiService} from '../../shared/services/department-api.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {

  departments: Department[];

  constructor(private departmentAPI: DepartmentApiService) { }

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentAPI.getDepartments().subscribe(
      (departments: Department[]) => this.departments = departments,
      (error => console.log(error))
    );
  }

}
