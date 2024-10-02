import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFbComponent } from './group-fb.component';

describe('GroupFbComponent', () => {
  let component: GroupFbComponent;
  let fixture: ComponentFixture<GroupFbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupFbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupFbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
