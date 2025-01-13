import { Component, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';

@Component({
  selector: 'an-profile',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  isEditing = false;
  isAddressEditing = false;
  apiUrl = environment.apiUrl + '/me/detail/';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      companyId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      this.loadProfileData(token);
    } else {
      console.error('Token nicht verfügbar.');
    }
  }

  loadProfileData(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Fehler beim Laden der Profildaten:', error);
        throw error;
      })
    ).subscribe(
      (data) => {
        this.profileForm.patchValue({
          companyName: data.company_name,
          companyId: data.company_identifier,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          email: data.email
        });
        this.cdr.detectChanges();
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  toggleAddressEdit(): void {
    this.isAddressEditing = !this.isAddressEditing;
  }

  saveChanges(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token nicht verfügbar.');
      return;
    }

    if (this.profileForm.valid) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(this.apiUrl, this.profileForm.value, { headers }).pipe(
        catchError((error) => {
          console.error('Fehler beim Speichern der Daten:', error);
          this.showPopupMessage('Fehler beim Speichern der Daten.', true);
          throw error;
        })
      ).subscribe(
        (response) => {
          console.log('Daten erfolgreich gespeichert:', response);
          this.isEditing = false;
          this.loadProfileData(token);
          this.showPopupMessage('Daten erfolgreich gespeichert!');
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

  showPopupMessage(message: string, isError: boolean = false): void {
    const popup = this.renderer.createElement('div');
    const text = this.renderer.createText(message);
    
    this.renderer.appendChild(popup, text);
    this.renderer.addClass(popup, 'popup');
    if (isError) {
      this.renderer.setStyle(popup, 'background-color', 'rgb(213, 27, 21)');
    } else {
      this.renderer.setStyle(popup, 'background-color', '#4caf50');
    }
    this.renderer.appendChild(document.body, popup);

    setTimeout(() => {
      this.renderer.removeChild(document.body, popup);
    }, 2000); 
  }
}
