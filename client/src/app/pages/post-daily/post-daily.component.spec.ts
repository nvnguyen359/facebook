import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDailyComponent } from './post-daily.component';

describe('PostDailyComponent', () => {
  let component: PostDailyComponent;
  let fixture: ComponentFixture<PostDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDailyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
