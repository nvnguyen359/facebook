import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertBalanceComponent } from './upsert-balance.component';

describe('UpsertBalanceComponent', () => {
  let component: UpsertBalanceComponent;
  let fixture: ComponentFixture<UpsertBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertBalanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpsertBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
