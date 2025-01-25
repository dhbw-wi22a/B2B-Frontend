import { Component, OnInit, Renderer2 } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'an-shipping-payment',
  templateUrl: './shipping-payment.component.html',
  styleUrls: ['./shipping-payment.component.css']
})
export class ShippingPaymentComponent implements OnInit {

  constructor(
    private darkModeService: DarkModeService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateDarkMode();
  }

  private updateDarkMode(): void {
    const isDarkModeEnabled = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode Status:', isDarkModeEnabled);

    if (isDarkModeEnabled) {
      this.renderer.addClass(document.body, 'dark-mode');
      console.log('Dark Mode aktiviert:', document.body.classList);
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      console.log('Dark Mode deaktiviert:', document.body.classList);
    }
  }
}
