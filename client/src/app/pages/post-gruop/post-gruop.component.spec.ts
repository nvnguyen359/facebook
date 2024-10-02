import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGruopComponent } from './post-gruop.component';

describe('PostGruopComponent', () => {
  let component: PostGruopComponent;
  let fixture: ComponentFixture<PostGruopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostGruopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostGruopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
