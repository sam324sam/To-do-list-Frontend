import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagView } from './tag-view';

describe('TagView', () => {
  let component: TagView;
  let fixture: ComponentFixture<TagView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
