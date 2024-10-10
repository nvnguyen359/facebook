import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdUpsertComponent } from './ad-upsert.component';

describe('AdUpsertComponent', () => {
  let component: AdUpsertComponent;
  let fixture: ComponentFixture<AdUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdUpsertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
