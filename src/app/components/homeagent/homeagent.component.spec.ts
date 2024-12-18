import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeagentComponent } from './homeagent.component';

describe('HomeagentComponent', () => {
  let component: HomeagentComponent;
  let fixture: ComponentFixture<HomeagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
