import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'an-root',  
  standalone: true,  
  template: `
  <nav>
    <a href="/impressum">impressum</a>
    <a href="/registrierung">registrierung</a>
    <a href="/startseite">startseite</a>
    <a href="/logout">logout</a>
    <a href="/produkte">produkte</a>
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


