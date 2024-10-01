import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedColumnsComponent } from './stacked-columns.component';

describe('StackedColumnsComponent', () => {
  let component: StackedColumnsComponent;
  let fixture: ComponentFixture<StackedColumnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StackedColumnsComponent]
    });
    fixture = TestBed.createComponent(StackedColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
