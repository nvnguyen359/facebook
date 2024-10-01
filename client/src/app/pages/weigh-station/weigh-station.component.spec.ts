import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighStationComponent } from './weigh-station.component';

describe('WeighStationComponent', () => {
  let component: WeighStationComponent;
  let fixture: ComponentFixture<WeighStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeighStationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeighStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
