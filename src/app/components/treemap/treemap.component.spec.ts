import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreemapComponent } from './treemap.component';

describe('TreemapComponent', () => {
  let component: TreemapComponent;
  let fixture: ComponentFixture<TreemapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TreemapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
