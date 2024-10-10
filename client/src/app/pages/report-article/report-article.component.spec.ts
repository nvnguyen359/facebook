import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportArticleComponent } from './report-article.component';

describe('ReportArticleComponent', () => {
  let component: ReportArticleComponent;
  let fixture: ComponentFixture<ReportArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
