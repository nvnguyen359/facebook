import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdTableComponent } from './ad-table.component';

describe('AdTableComponent', () => {
  let component: AdTableComponent;
  let fixture: ComponentFixture<AdTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
