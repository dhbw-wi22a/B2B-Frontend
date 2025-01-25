import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPaymentComponent } from './shipping-payment.component';

describe('ShippingPaymentComponent', () => {
  let component: ShippingPaymentComponent;
  let fixture: ComponentFixture<ShippingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
