import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskForm } from './add-task-form';

describe('AddTaskForm', () => {
  let component: AddTaskForm;
  let fixture: ComponentFixture<AddTaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
