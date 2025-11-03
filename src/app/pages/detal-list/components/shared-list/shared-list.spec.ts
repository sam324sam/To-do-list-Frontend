import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedList } from './shared-list';

describe('SharedList', () => {
  let component: SharedList;
  let fixture: ComponentFixture<SharedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
