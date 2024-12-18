import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenudaComponent } from './menuda.component';

describe('MenudaComponent', () => {
  let component: MenudaComponent;
  let fixture: ComponentFixture<MenudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenudaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
