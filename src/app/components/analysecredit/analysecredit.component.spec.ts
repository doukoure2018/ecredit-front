import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysecreditComponent } from './analysecredit.component';

describe('AnalysecreditComponent', () => {
  let component: AnalysecreditComponent;
  let fixture: ComponentFixture<AnalysecreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysecreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysecreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
