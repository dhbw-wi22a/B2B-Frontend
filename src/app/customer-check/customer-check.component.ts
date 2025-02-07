import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'an-customer-check',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './customer-check.component.html',
  styleUrls: ['./customer-check.component.css']
})
export class CustomerCheckComponent implements OnInit {
  customercheckForm: FormGroup;
  apiUrl = environment.apiUrl + '/me/detail/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
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
  
  get isLoggedIn(): boolean { 
    return this.authService.isLoggedIn(); 
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.loadUserData();
    }
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

  async loadUserData(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token nicht verfügbar.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    try {
      const data = await this.http.get<any>(this.apiUrl, { headers }).toPromise();
      this.customercheckForm.patchValue({
        company: data.company_name,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        street: data.street,
        houseNumber: data.house_number,
        zipCode: data.zip_code,
        city: data.city
      });
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }
}
