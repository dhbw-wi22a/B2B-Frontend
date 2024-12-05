import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'an-registrierung',
  imports: [],
  templateUrl: './registrierung.component.html',
  styleUrl: './registrierung.component.css'
})
export class RegistrierungComponent {
  constructor(private router: Router) {}

  navigateToStartseite(): void {
    this.router.navigate(['']); 
  }
}
