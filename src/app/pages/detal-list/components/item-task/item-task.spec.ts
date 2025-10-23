import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTask } from './item-task';

describe('ItemTask', () => {
  let component: ItemTask;
  let fixture: ComponentFixture<ItemTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
