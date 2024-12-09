import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'an-registration',
  imports: [],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(private router: Router) {}

  navigateToStartseite(): void {
    this.router.navigate(['']); 
  }

}
