import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsAdminCellRenderComponent } from './is-admin-cell-render.component';

describe('IsAdminCellRenderComponent', () => {
  let component: IsAdminCellRenderComponent;
  let fixture: ComponentFixture<IsAdminCellRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsAdminCellRenderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsAdminCellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
