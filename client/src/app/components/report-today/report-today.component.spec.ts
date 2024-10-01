import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTodayComponent } from './report-today.component';

describe('ReportTodayComponent', () => {
  let component: ReportTodayComponent;
  let fixture: ComponentFixture<ReportTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTodayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
