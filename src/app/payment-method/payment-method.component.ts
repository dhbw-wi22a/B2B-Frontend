import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'an-payment-method',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, HttpClientModule],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  paymentForm: FormGroup;
  selectedPaymentType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private darkModeService: DarkModeService,
    private authService: AuthService,
  ) { 
    this.paymentForm = this.fb.group({
      paymentType: ['', Validators.required],
      cardName: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvc: [''],
      paypalEmail: [''],
      bankAccount: [''],
      bankIban: [''],
      bankBic: ['']
    });
  }

  get isLoggedIn(): boolean { 
    return this.authService.isLoggedIn(); 
  }

  ngOnInit(): void {
    const isDarkModeEnabled = this.darkModeService.isDarkModeEnabled();
    if (isDarkModeEnabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    console.log('Dark Mode Status:', isDarkModeEnabled);
  }

  get f() { return this.paymentForm.controls; }

  onCheckboxChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedPaymentType = value;
    this.f['paymentType'].setValue(value);

    const controlsToUpdate = ['cardName', 'cardNumber', 'cardExpiry', 'cardCvc', 'paypalEmail', 'bankAccount', 'bankIban', 'bankBic'];

    controlsToUpdate.forEach(control => {
      const formControl = this.f[control];
      if (!formControl) return;

      if (this.selectedPaymentType === 'creditCard' && ['cardName', 'cardNumber', 'cardExpiry', 'cardCvc'].includes(control)) {
        formControl.setValidators([Validators.required]);
      } else if (this.selectedPaymentType === 'paypal' && control === 'paypalEmail') {
        formControl.setValidators([Validators.required, Validators.email]);
      } else if (this.selectedPaymentType === 'bankTransfer' && ['bankAccount', 'bankIban', 'bankBic'].includes(control)) {
        formControl.setValidators([Validators.required]);
      } else {
        formControl.clearValidators();
      }
    });

    this.paymentForm.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}');
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]').map((item: any) => ({
        item_id: item.item_id,
        item_name: item.item_details.item_name,
        quantity: item.quantity
      }));

      console.log('Abgerufene Käuferinformationen:', orderDetails);

      orderDetails.items = cartItems;

      console.log('Sende Bestellung an das Backend:', orderDetails);

      const token = localStorage.getItem('authToken');
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

      this.http.post(`${environment.apiUrl}/me/orders/?format=json`, orderDetails, { headers })
        .subscribe(response => {
          console.log('Bestellung erfolgreich an das Backend gesendet:', response);
          localStorage.removeItem('cart');
          localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
          this.router.navigate(['/confirmation']);
        }, error => {
          console.log('Fehler beim Senden der Bestellung:', error);
        });
    } else {
      console.log('Formular ist ungültig');
    }
  }
}
