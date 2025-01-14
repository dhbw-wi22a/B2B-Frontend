import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  addressForm!: FormGroup;
  isEditing = false;
  isAddressEditing = false;
  apiUrl = `${environment.apiUrl}/me/profile/`;
  isLoading = true;
  showSuccessMessage = false; // Flag für die Anzeige der Benachrichtigung

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfileData();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      companyId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
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
        };

        this.profileForm.patchValue(this.profileData);

        this.isLoading = false;
        this.cdr.detectChanges();
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

  toggleAddressEdit(): void {
    this.isAddressEditing = !this.isAddressEditing;
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const updatedData = {
        company_name: this.profileForm.value.companyName,
        company_identifier: this.profileForm.value.companyId,
        first_name: this.profileForm.value.firstName,
        last_name: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
        email: this.profileForm.value.email,
      };
  
      const csrfToken = this.getCsrfToken();
      const headers = new HttpHeaders({
        'X-CSRFToken': csrfToken,
      });
  
      // Disable the button to prevent further clicks
      const saveButton = document.querySelector('.save-btn') as HTMLButtonElement;
      if (saveButton) {
        saveButton.disabled = true; // Disable the button
      }
  
      this.http.post(this.apiUrl, updatedData, { headers }).subscribe(
        () => {
          this.isEditing = false;
          this.profileData = { ...updatedData };
  
          // Zeige die Erfolgsmeldung an und trigger Change Detection
          this.showSuccessMessage = true;
  
          // Manuelle Auslösung der Change Detection
          this.cdr.detectChanges(); 
  
          // Nach 2 Sekunden Weiterleitung zur Startseite
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          console.error('Fehler beim Speichern der Daten:', error);
        },
        () => {
          // Enable the button again after the request is finished
          if (saveButton) {
            saveButton.disabled = false; // Re-enable the button
          }
        }
      );
    }
  }
  
  

  saveAddressChanges(): void {
    if (this.addressForm.valid) {
      console.log('Address data:', this.addressForm.value);
      this.isAddressEditing = false;
      this.showPopupMessage('Lieferadresse erfolgreich gespeichert!');
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

  private showPopupMessage(message: string): void {
    alert(message); // Nachricht zur Benachrichtigung des Users
  }
}
