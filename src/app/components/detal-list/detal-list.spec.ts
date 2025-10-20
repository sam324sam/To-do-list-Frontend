import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalList } from './detal-list';

describe('DetalList', () => {
  let component: DetalList;
  let fixture: ComponentFixture<DetalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
