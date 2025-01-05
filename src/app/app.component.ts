import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { Router } from '@angular/router'; 
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';
  


@Component({
  selector: 'an-root',  
  standalone: true,  
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
  imports: [RouterOutlet, RouterLink, NgIf], 
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.css']  
})

export class AppComponent {
  title = 'B2B-Webshop'; 
  
  constructor(private authService: AuthService) { } 
  
  get isLoggedIn(): boolean { 
    return this.authService.isLoggedIn(); 
  }
  
}


