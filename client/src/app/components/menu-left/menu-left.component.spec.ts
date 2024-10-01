import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLeftComponent } from './menu-left.component';

describe('MenuLeftComponent', () => {
  let component: MenuLeftComponent;
  let fixture: ComponentFixture<MenuLeftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuLeftComponent]
    });
    fixture = TestBed.createComponent(MenuLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
