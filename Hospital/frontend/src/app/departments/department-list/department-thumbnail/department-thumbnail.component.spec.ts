import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentThumbnailComponent } from './department-thumbnail.component';

describe('DepartmentThumbnailComponent', () => {
  let component: DepartmentThumbnailComponent;
  let fixture: ComponentFixture<DepartmentThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
