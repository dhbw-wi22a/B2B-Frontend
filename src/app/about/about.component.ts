import { Component, OnInit, Renderer2 } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private darkModeService: DarkModeService, private renderer: Renderer2) {}

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
}
