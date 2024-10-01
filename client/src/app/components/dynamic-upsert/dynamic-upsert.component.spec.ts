import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicUpsertComponent } from './dynamic-upsert.component';

describe('DynamicUpsertComponent', () => {
  let component: DynamicUpsertComponent;
  let fixture: ComponentFixture<DynamicUpsertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicUpsertComponent]
    });
    fixture = TestBed.createComponent(DynamicUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
