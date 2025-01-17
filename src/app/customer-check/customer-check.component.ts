import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'an-customer-check',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer-check.component.html',
  styleUrls: ['./customer-check.component.css']
})
export class CustomerCheckComponent implements OnInit {
  customercheckForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.customercheckForm = this.fb.group({
      company: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.customercheckForm.valid) {
      const userDetails = {
        buyer_name: `${this.customercheckForm.get('firstName')?.value} ${this.customercheckForm.get('lastName')?.value}`,
        buyer_email: this.customercheckForm.get('email')?.value,
        buyer_phone: this.customercheckForm.get('phone')?.value,
        buyer_address: `${this.customercheckForm.get('street')?.value} ${this.customercheckForm.get('houseNumber')?.value}, ${this.customercheckForm.get('city')?.value}, ${this.customercheckForm.get('zipCode')?.value}`
      };
      const orderDetails = {
        order_info: userDetails,
        items: []
      };
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      
      console.log('Bestellung erfolgreich gespeichert:', orderDetails);
      this.router.navigate(['/payment-method']);
    } else {
      console.log('Formular ist ungültig');
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/registration']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
