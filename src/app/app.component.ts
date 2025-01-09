import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

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

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  get isLoggedIn(): boolean { 
    return this.authService.isLoggedIn(); 
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
