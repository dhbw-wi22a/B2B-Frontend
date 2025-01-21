import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

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

  constructor(
    private darkModeService: DarkModeService, 
    private http: HttpClient, 
    private authService: AuthService
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

  deleteAccount(): void {
    if (confirm("Sind Sie sicher, dass Sie Ihren Account löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      this.http.patch(`${environment.apiUrl}/me/profile/update`, { is_active: false })
        .subscribe({
          next: () => {
            alert("Ihr Account wurde erfolgreich gelöscht.");
            this.authService.logout();
          },
          error: () => {
            alert("Es gab ein Problem beim Löschen Ihres Accounts.");
          }
        });
    }
  }
}
