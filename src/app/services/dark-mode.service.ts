import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkMode = false;

  constructor() { 
    this.loadDarkModePreference();
  }

  enableDarkMode(): void {
    this.isDarkMode = true;
    document.body.classList.add('dark-mode');
    console.log('Dark Mode aktiviert:', document.body.classList);
    this.saveDarkModePreference();
  }

  disableDarkMode(): void {
    this.isDarkMode = false;
    document.body.classList.remove('dark-mode');
    console.log('Dark Mode deaktiviert:', document.body.classList);
    this.saveDarkModePreference();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }

  private saveDarkModePreference(): void {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = "darkMode=" + (this.isDarkMode ? "true" : "false") + ";" + expires + ";path=/";
  }

  private loadDarkModePreference(): void {
    const name = "darkMode=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        const darkModePreference = cookie.substring(name.length, cookie.length);
        if (darkModePreference === 'true') {
          this.enableDarkMode();
        } else {
          this.disableDarkMode();
        }
        return;
      }
    }
    this.disableDarkMode();
  }
}
