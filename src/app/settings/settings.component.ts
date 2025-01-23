import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'an-settings',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  isDarkMode = false;
  showFields = false;
  showDeleteModal = false;

  constructor(
    private darkModeService: DarkModeService, 
    private http: HttpClient, 
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router,
  ) {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode initialer Zustand:', this.isDarkMode);
  }

  showPasswordFields(): void {
    this.showFields = true;
  }

  changePassword(): void {
    alert("Ihr Passwort wurde erfolgreich geändert.");
  }

  changeLanguage(event: any): void {
    const selectedLanguage = event.target.value;
    alert(`Ist noch funktionslos`);
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteAccount(): void {
    this.openDeleteModal();
  }

  confirmedDeleteAccount(): void {
    const token = this.authService.getAuthToken();
    this.http.delete(`${environment.apiUrl}/me/profile/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: { is_active: false }
    }).subscribe({
      next: () => {
        this.showPopupMessage("Ihr Account wurde erfolgreich gelöscht.", false);
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Fehler beim Löschen des Accounts:', error);
        this.showPopupMessage("Es gab ein Problem beim Löschen Ihres Accounts.", true);
      }
    });
    this.closeDeleteModal();
  }

  showPopupMessage(message: string, isError: boolean = false): void {
    const popup = this.renderer.createElement('div');
    const text = this.renderer.createText(message);

    this.renderer.appendChild(popup, text);
    this.renderer.addClass(popup, 'popup');
    if (isError) {
      this.renderer.addClass(popup, 'error');
    } else {
      this.renderer.addClass(popup, 'success');
    }
    this.renderer.appendChild(document.body, popup);

    setTimeout(() => {
      this.renderer.removeChild(document.body, popup);
    }, 2000);
  }
}
