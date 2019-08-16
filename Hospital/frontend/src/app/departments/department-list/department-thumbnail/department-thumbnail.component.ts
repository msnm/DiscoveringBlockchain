import {Component, Input, OnInit} from '@angular/core';
import {Department} from '../../../shared/model/department.model';

@Component({
  selector: 'app-department-thumbnail',
  templateUrl: './department-thumbnail.component.html',
  styleUrls: ['./department-thumbnail.component.css']
})
export class DepartmentThumbnailComponent implements OnInit {

  @Input() department: Department;

  constructor() { }

  ngOnInit() {

  }

}
