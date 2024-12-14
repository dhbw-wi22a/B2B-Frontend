import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { Router } from '@angular/router'; 


@Component({
  selector: 'an-root',  
  standalone: true,  
  template: `
  <nav>
    <a href="/imprint">imprint</a>
    <a href="/registration">registration</a>
    <a href="/homepage">homepage</a>
    <a href="/logout">logout</a>
    <a href="/products">products</a>
    <a href="/shopping-cart">shopping-cart</a>
    <a href="/customer-check">customer-check</a>
    <a href="/payment-method">payment-method</a>
    <a href="/confirmation">confirmation</a>
  </nav>
  <router-outlet />
`,
  imports: [RouterOutlet, RouterLink], 
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.css']  
})

export class AppComponent {
  title = 'B2B-Webshop';  
}


