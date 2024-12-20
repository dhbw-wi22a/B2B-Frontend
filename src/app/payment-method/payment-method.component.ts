import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { environment } from '../../../src/enviroments/environment';  // Importiere die Umgebungsvariable

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

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
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

  ngOnInit(): void {}

  onCheckboxChange(event: any): void {
    const value = event.target.value;
    this.selectedPaymentType = value;
    this.paymentForm.get('paymentType')?.setValue(value);

    const controlsToUpdate = ['cardName', 'cardNumber', 'cardExpiry', 'cardCvc', 'paypalEmail', 'bankAccount', 'bankIban', 'bankBic'];
    
    controlsToUpdate.forEach(control => {
      const formControl = this.paymentForm.get(control);
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
      formControl.updateValueAndValidity();
    });

    this.paymentForm.updateValueAndValidity(); 
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}');
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]').map((item: any) => ({
        item: item.item_id,
        item_name: item.item_details.item_name,
        quantity: item.quantity
      }));
      
      console.log('Abgerufene Käuferinformationen:', orderDetails);
  
      orderDetails.items = cartItems;
  
      console.log('Sende Bestellung an das Backend:', orderDetails);
      
      this.http.post(`${environment.apiUrl}/orders/?format=json`, orderDetails)
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
