import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionTableComponent } from './expansion-table.component';

describe('ExpansionTableComponent', () => {
  let component: ExpansionTableComponent;
  let fixture: ComponentFixture<ExpansionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpansionTableComponent]
    });
    fixture = TestBed.createComponent(ExpansionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
