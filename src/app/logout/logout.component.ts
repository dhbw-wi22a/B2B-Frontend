import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'an-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.authService.logout();
    this.ngZone.run(() => {
      console.log('Ausgeloggt');
      this.cdr.detectChanges();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
