import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCustomComponent } from './input-custom.component';

describe('InputCustomComponent', () => {
  let component: InputCustomComponent;
  let fixture: ComponentFixture<InputCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCustomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
