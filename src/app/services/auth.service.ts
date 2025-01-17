import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    private get authToken(): string | null {
        return localStorage.getItem('authToken');
    }

    private set authToken(token: string | null) {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    async login(email: string, password: string): Promise<void> {
        const loginData = { email, password };

        try {
            const loginResponse = await this.http.post<{ access: string }>(`${environment.apiUrl}/auth/login/`, loginData).toPromise();
            if (loginResponse) {
                console.log('Login erfolgreich!', loginResponse);
                this.authToken = loginResponse.access;
            } else {
                this.handleError('Unerwartete Antwort des Servers.');
            }
        } catch (error) {
            this.handleError('Login fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.');
        }
    }

    logout(): void {
        this.authToken = null;
        console.log('Logout erfolgreich');
    }

    isLoggedIn(): boolean {
        return !!this.authToken;
    }

    private handleError(error: any): void {
        console.log('Ein Fehler ist aufgetreten:', error);
        alert(error);
    }
}
