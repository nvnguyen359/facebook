import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintersComponent } from './printers.component';

describe('PrintersComponent', () => {
  let component: PrintersComponent;
  let fixture: ComponentFixture<PrintersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintersComponent]
    });
    fixture = TestBed.createComponent(PrintersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
