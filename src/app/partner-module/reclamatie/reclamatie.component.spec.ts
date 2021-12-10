import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamatieComponent } from './reclamatie.component';

describe('ReclamatieComponent', () => {
  let component: ReclamatieComponent;
  let fixture: ComponentFixture<ReclamatieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamatieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamatieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
