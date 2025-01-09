import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../enviroments/environment';

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
        console.log('Login fehlgeschlagen', error);
        alert('Login fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.');
      }
    );
  }

  navigateToStartseite(): void {
    this.router.navigate(['/']);
  }
}
