import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DarkModeService } from './services/dark-mode.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';

@Component({
  selector: 'an-root',  
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <nav>
    <a href="/about">about</a>
    <a href="/admin-dashboard">admin-dashboard</a>
    <a href="/company-area">company-area</a>
    <a href="/confirmation">confirmation</a>
    <a href="/customer-check">customer-check</a>
    <a href="/privacy">privacy</a>
    <a href="/imprint">imprint</a>
    <a href="/login">login</a>
    <a href="/logout">logout</a>
    <a href="/order-history">order-history</a>
    <a href="/payment-method">payment-method</a>
    <a href="/shipping-payment">shipping-payment</a>
    <a href="/products">products</a>
    <a href="/profile">profile</a>
    <a href="/registration">registration</a>
    <a href="/settings">settings</a>
    <a href="/shopping-cart">shopping-cart</a> 
    <a href="/wishlist">wishlist</a>
  </nav>
  `,
  imports: [RouterOutlet, RouterLink, NgIf, HttpClientModule, FormsModule], 
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.css']  
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'B2B-Webshop'; 
  isDarkMode = false;
  searchText: string = '';

  constructor(
    private authService: AuthService, 
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private darkModeService: DarkModeService,
    private searchService: SearchService
  ) {}

  get isLoggedIn(): boolean { 
    return this.authService.isLoggedIn(); 
  }

  updateSearchText() {
    this.searchService.setSearchText(this.searchText);
  }

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode Status:', this.isDarkMode);
    if (this.isDarkMode) {
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

  setLightMode(): void {
    this.darkModeService.disableDarkMode();
    this.isDarkMode = false;
    this.renderer.removeClass(document.body, 'dark-mode');
    console.log('Heller Modus aktiviert');
  }

  setDarkMode(): void {
    this.darkModeService.enableDarkMode();
    this.isDarkMode = true;
    this.renderer.addClass(document.body, 'dark-mode');
    console.log('Dunkler Modus aktiviert');
  }
}
