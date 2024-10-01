import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutProductComponent } from './donut-product.component';

describe('DonutProductComponent', () => {
  let component: DonutProductComponent;
  let fixture: ComponentFixture<DonutProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonutProductComponent]
    });
    fixture = TestBed.createComponent(DonutProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
