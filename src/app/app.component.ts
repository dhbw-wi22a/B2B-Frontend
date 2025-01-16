import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DarkModeService } from './services/dark-mode.service';

@Component({
  selector: 'an-root',  
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <nav>
    <a href="/admin-dashboard">admin-dashboard</a>
    <a href="/company-profile">company-profile</a>
    <a href="/confirmation">confirmation</a>
    <a href="/customer-check">customer-check</a>
    <a href="/imprint">imprint</a>
    <a href="/login">login</a>
    <a href="/logout">logout</a>
    <a href="/order-history">order-history</a>
    <a href="/payment-method">payment-method</a>
    <a href="/products">products</a>
    <a href="/profile">profile</a>
    <a href="/registration">registration</a>
    <a href="/settings">settings</a>
    <a href="/shopping-cart">shopping-cart</a> 
  </nav>
  <router-outlet />
  `,
  imports: [RouterOutlet, RouterLink, NgIf, HttpClientModule], 
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements AfterViewInit {
  title = 'B2B-Webshop'; 

  constructor(
    private authService: AuthService, 
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private darkModeService: DarkModeService
  ) {}

  get isLoggedIn(): boolean { 
    return this.authService.isLoggedIn(); 
  }

  ngOnInit(): void {
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

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
