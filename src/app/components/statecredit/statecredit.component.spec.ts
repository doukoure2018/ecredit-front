import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatecreditComponent } from './statecredit.component';

describe('StatecreditComponent', () => {
  let component: StatecreditComponent;
  let fixture: ComponentFixture<StatecreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatecreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatecreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
