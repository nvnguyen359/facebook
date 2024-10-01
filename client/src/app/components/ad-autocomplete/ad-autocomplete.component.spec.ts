import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdAutocompleteComponent } from './ad-autocomplete.component';

describe('AdAutocompleteComponent', () => {
  let component: AdAutocompleteComponent;
  let fixture: ComponentFixture<AdAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
