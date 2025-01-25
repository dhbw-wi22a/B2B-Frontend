import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'an-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private darkModeService: DarkModeService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.updateDarkMode();
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

  private updateDarkMode(): void {
    const isDarkModeEnabled = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode Status:', isDarkModeEnabled);

    if (isDarkModeEnabled) {
      this.renderer.addClass(document.body, 'dark-mode');
      console.log('Dark Mode aktiviert:', document.body.classList);
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      console.log('Dark Mode deaktiviert:', document.body.classList);
    }
  }
}
