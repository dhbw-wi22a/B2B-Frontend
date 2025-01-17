import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'an-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, HttpClientModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<{ access: string }>(`${environment.apiUrl}/auth/login/`, loginData).subscribe(
      loginResponse => {
        console.log('Login erfolgreich!', loginResponse);

        const token = loginResponse.access;
        localStorage.setItem('authToken', token);

        this.router.navigate(['/']);
      },
      error => {
        this.handleLoginError(error);
      }
    );
  }

  navigateToStartseite(): void {
    this.router.navigate(['/']);
  }

  private handleLoginError(error: any): void {
    console.log('Login fehlgeschlagen', error);
    alert('Login fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.');
  }
}
