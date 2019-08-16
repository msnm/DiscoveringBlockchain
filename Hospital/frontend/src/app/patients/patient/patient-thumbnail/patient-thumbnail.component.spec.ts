import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientThumbnailComponent } from './patient-thumbnail.component';

describe('PatientThumbnailComponent', () => {
  let component: PatientThumbnailComponent;
  let fixture: ComponentFixture<PatientThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
