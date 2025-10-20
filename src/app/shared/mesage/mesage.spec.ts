import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mesage } from './mesage';

describe('Mesage', () => {
  let component: Mesage;
  let fixture: ComponentFixture<Mesage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mesage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mesage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
