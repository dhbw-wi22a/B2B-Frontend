import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'an-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  imports: [FormsModule, NgIf, HttpClientModule]
})
export class RegistrationComponent {
  firstName: string = '';
  lastName: string = '';
  companyName: string = '';
  companyId: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  navigateToStartseite(): void {
    this.router.navigate(['/']);
  }

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwörter stimmen nicht überein.';
      return;
    }
    if (!this.termsAccepted) {
      this.errorMessage = 'Sie müssen die AGB akzeptieren.';
      return;
    }

    const registrationData = {
      email: this.email,
      password: this.password,
      password_confirm: this.confirmPassword
    };

    this.http.post<{ access: string }>(`${environment.apiUrl}/auth/register/`, registrationData).subscribe(
      response => {
        console.log('Registrierung erfolgreich!', response);
        const token = response.access;
        localStorage.setItem('authToken', token);

        this.login();
      },
      error => {
        this.handleError(error);
      }
    );
  }

  login(): void {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<{ access: string }>(`${environment.apiUrl}/auth/login/`, loginData).subscribe(
      response => {
        console.log('Login erfolgreich!', response);
        const newToken = response.access;
        localStorage.setItem('authToken', newToken);

        this.updateProfile(newToken);
      },
      error => {
        console.error('Loginfehler', error);
      }
    );
  }

  updateProfile(token: string): void {
    const profileData = {
      email: this.email,
      company_identifier: this.companyId,
      company_name: this.companyName,
      first_name: this.firstName,
      last_name: this.lastName
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.apiUrl}/me/profile/`, profileData, { headers }).subscribe(
      response => {
        console.log('Profilaktualisierung erfolgreich!', response);
        this.navigateToStartseite();
      },
      error => {
        console.error('Profilaktualisierungsfehler', error);
      }
    );
  }

  private handleError(error: any): void {
    if (error.status === 400 && error.error && error.error.email) {
      this.errorMessage = `Fehler bei der Registrierung: ${error.error.email.join(', ')}`;
    } else {
      this.errorMessage = 'Es gab ein Problem bei der Registrierung.';
    }
    console.error('Registrierungsfehler', error);
  }
}
