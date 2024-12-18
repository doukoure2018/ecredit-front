import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnecautionComponent } from './personnecaution.component';

describe('PersonnecautionComponent', () => {
  let component: PersonnecautionComponent;
  let fixture: ComponentFixture<PersonnecautionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnecautionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnecautionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
