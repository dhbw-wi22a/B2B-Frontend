import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    const isDarkModeEnabled = this.darkModeService.isDarkModeEnabled();
    console.log('Dark Mode Status:', isDarkModeEnabled);
  }
}
