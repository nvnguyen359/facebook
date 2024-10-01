import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOrderComponent } from './chart-order.component';

describe('ChartOrderComponent', () => {
  let component: ChartOrderComponent;
  let fixture: ComponentFixture<ChartOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartOrderComponent]
    });
    fixture = TestBed.createComponent(ChartOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
