import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'an-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(private readonly router: Router) {}

  deleteAccount(): void {
    if (confirm("Sind Sie sicher, dass Sie Ihren Account löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      alert("Ihr Account wurde erfolgreich gelöscht.");
      this.navigateToStartseite();
    }
  }

  navigateToStartseite(): void {
    this.router.navigate(['']); 
  }
}
