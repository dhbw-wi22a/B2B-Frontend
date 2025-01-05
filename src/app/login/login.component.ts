import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'an-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password);
    if (this.authService.isLoggedIn()) {
      console.log('Login erfolgreich');
      this.router.navigate(['/']);
    } else {
      console.log('Login fehlgeschlagen'); 
      // Zeige eine Fehlermeldung an
      alert('Login fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.');
    }
  }

  navigateToStartseite(): void {
    this.router.navigate(['']);
  }
}
