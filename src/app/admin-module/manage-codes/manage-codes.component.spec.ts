import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCodesComponent } from './manage-codes.component';

describe('ManageCodesComponent', () => {
  let component: ManageCodesComponent;
  let fixture: ComponentFixture<ManageCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
