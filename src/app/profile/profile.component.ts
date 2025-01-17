import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DarkModeService } from '../services/dark-mode.service';

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
    private darkModeService: DarkModeService
  ) {}

  get authToken(): string | null {
    return localStorage.getItem('authToken');
  }

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

    if (this.authToken) {
      this.loadProfileData(this.authToken);
    } else {
      console.error('Token nicht verfügbar.');
    }

    // Überprüfe und wende den Dark Mode an
    if (this.darkModeService.isDarkModeEnabled()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  async loadProfileData(token: string): Promise<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    try {
      const data = await this.http.get<any>(this.apiUrl, { headers }).pipe(
        catchError((error) => {
          console.error('Fehler beim Laden der Profildaten:', error);
          throw error;
        })
      ).toPromise();

      this.profileForm.patchValue({
        companyName: data.company_name,
        companyId: data.company_identifier,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        email: data.email
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  toggleAddressEdit(): void {
    this.isAddressEditing = !this.isAddressEditing;
  }

  async saveChanges(): Promise<void> {
    if (!this.authToken) {
      console.error('Token nicht verfügbar.');
      return;
    }

    if (this.profileForm.valid) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);

      try {
        const response = await this.http.post(this.apiUrl, this.profileForm.value, { headers }).pipe(
          catchError((error) => {
            console.error('Fehler beim Speichern der Daten:', error);
            this.showPopupMessage('Fehler beim Speichern der Daten.', true);
            throw error;
          })
        ).toPromise();

        console.log('Daten erfolgreich gespeichert:', response);
        this.isEditing = false;
        this.loadProfileData(this.authToken);
        this.showPopupMessage('Daten erfolgreich gespeichert!');
      } catch (error) {
        this.handleError(error);
      }
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
    this.renderer.setStyle(popup, 'background-color', isError ? 'rgb(213, 27, 21)' : '#4caf50');
    this.renderer.appendChild(document.body, popup);

    setTimeout(() => {
      this.renderer.removeChild(document.body, popup);
    }, 2000);
  }

  private handleError(error: any): void {
    console.error('Ein Fehler ist aufgetreten:', error);
    this.showPopupMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', true);
  }
}
