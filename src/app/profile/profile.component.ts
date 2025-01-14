import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/environment';

@Component({
  selector: 'an-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  profileForm!: FormGroup;
  isEditing = false;
  apiUrl = `${environment.apiUrl}/me/profile/`;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfileData(); // Lade die Profildaten beim Aufruf der Seite
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      companyId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['********'] // Passwort bleibt Platzhalter
    });
  }

  loadProfileData(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (data) => {
        this.profileData = {
          companyName: data.company_name || 'Nicht verfügbar',
          companyId: data.company_identifier || 'Nicht verfügbar',
          firstName: data.first_name || 'Nicht verfügbar',
          lastName: data.last_name || 'Nicht verfügbar',
          phone: data.phone || 'Nicht verfügbar',
          email: data.email || 'Nicht verfügbar',
          password: '********' // Passwort bleibt Platzhalter
        };

        // Fülle das Formular mit den geladenen Daten
        this.profileForm.patchValue(this.profileData);
      },
      (error) => {
        console.error('Fehler beim Laden der Profildaten:', error);
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.profileData) {
      this.profileForm.patchValue(this.profileData);
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const updatedData = {
        company_name: this.profileForm.value.companyName,
        company_identifier: this.profileForm.value.companyId,
        first_name: this.profileForm.value.firstName,
        last_name: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
        email: this.profileForm.value.email
      };

      const csrfToken = this.getCsrfToken();
      const headers = new HttpHeaders({
        'X-CSRFToken': csrfToken
      });

      this.http.post(this.apiUrl, updatedData, { headers }).subscribe(
        () => {
          this.router.navigate(['/'], { state: { message: 'Profildaten erfolgreich geändert!' } });
        },
        (error) => {
          console.error('Fehler beim Speichern der Daten:', error);
        }
      );
    } else {
      console.error('Das Formular ist ungültig.');
    }
  }

  getCsrfToken(): string {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return value;
      }
    }
    return '';
  }
}
