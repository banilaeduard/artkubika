import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListItemsComponent } from './cart-list-items.component';

describe('CartListItemsComponent', () => {
  let component: CartListItemsComponent;
  let fixture: ComponentFixture<CartListItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartListItemsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
