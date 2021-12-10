import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamatiiComponent } from './reclamatii.component';

describe('ReclamatiiComponent', () => {
  let component: ReclamatiiComponent;
  let fixture: ComponentFixture<ReclamatiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamatiiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamatiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
