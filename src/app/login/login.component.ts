import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'an-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, HttpClientModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordResetUrl: string = environment.passwordResetUrl;

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private darkModeService: DarkModeService,
    private renderer: Renderer2
  ) {}

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

        this.showPopupMessage('Login erfolgreich!', false);
        this.router.navigate(['/']);
      },
      error => {
        this.handleLoginError(error);
      }
    );
  }

  navigateToStartseite(): void {
    this.router.navigate(['/registration']);
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  private handleLoginError(error: any): void {
    console.log('Login fehlgeschlagen', error);
    this.showPopupMessage('Login fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.', true);
  }

  private showPopupMessage(message: string, isError: boolean = false): void {
    const popup = this.renderer.createElement('div');
    const text = this.renderer.createText(message);

    this.renderer.appendChild(popup, text);
    this.renderer.addClass(popup, 'login-popup');
    this.renderer.addClass(popup, isError ? 'error' : 'success');
    this.renderer.appendChild(document.body, popup);

    setTimeout(() => {
      this.renderer.removeChild(document.body, popup);
    }, 2000);
  }
}
