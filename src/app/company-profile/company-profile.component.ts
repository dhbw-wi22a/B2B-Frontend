import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'an-company-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;

  apiUrl = 'http://example.com/api/me/profile'; // Ersetze mit deiner API-URL

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      companyId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loadProfileData();
  }

  loadProfileData(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (data) => {
        this.profileForm.patchValue({
          companyName: data.company_name,
          companyId: data.company_identifier,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          email: data.email,
          password: '********' // Platzhalter für das Passwort
        });
      },
      (error) => {
        console.error('Fehler beim Laden der Profildaten:', error);
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      this.http.put(this.apiUrl, this.profileForm.value).subscribe(
        (response) => {
          console.log('Daten erfolgreich gespeichert:', response);
          this.isEditing = false;
        },
        (error) => {
          console.error('Fehler beim Speichern der Daten:', error);
        }
      );
    }
  }
}
