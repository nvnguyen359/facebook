import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayHtmlComponent } from './display-html.component';

describe('DisplayHtmlComponent', () => {
  let component: DisplayHtmlComponent;
  let fixture: ComponentFixture<DisplayHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayHtmlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
