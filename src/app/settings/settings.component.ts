import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'an-settings',
  standalone: true,
  encapsulation: ViewEncapsulation.None,  // Dies deaktiviert die ViewEncapsulation
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  isDarkMode = false;

  constructor(private darkModeService: DarkModeService) {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode initialer Zustand:', this.isDarkMode);
  }

  changePassword(): void {
    alert("Ihr Passwort wurde erfolgreich geändert.");
  }

  toggleDarkMode(event: any): void {
    this.darkModeService.toggleDarkMode();
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode Zustand nach Toggle:', this.isDarkMode);
  }

  setLightMode(): void {
    this.darkModeService.disableDarkMode();
    this.isDarkMode = false;
    console.log('Heller Modus aktiviert');
  }

  setDarkMode(): void {
    this.darkModeService.enableDarkMode();
    this.isDarkMode = true;
    console.log('Dunkler Modus aktiviert');
  }

  changeLanguage(event: any): void {
    const selectedLanguage = event.target.value;
    alert(`Die Sprache wurde auf ${selectedLanguage} geändert.`);
  }

  deleteAccount(): void {
    if (confirm("Sind Sie sicher, dass Sie Ihren Account löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      alert("Ihr Account wurde erfolgreich gelöscht.");
    }
  }
}
