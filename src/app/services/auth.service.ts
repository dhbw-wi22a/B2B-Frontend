import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login(email: string, password: string) {
        const loginData = { email, password };

        this.http.post<{ access: string }>(`${environment.apiUrl}/auth/login/`, loginData).subscribe(
            loginResponse => {
                console.log('Login erfolgreich!', loginResponse);
                
                const token = loginResponse.access;
        
                localStorage.setItem('authToken', token);
            },
            error => {
                console.log('Login fehlgeschlagen: ', error);
                alert('Login fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.');
            }
        );
    }

    logout() {
        localStorage.removeItem('authToken');
        console.log('Logout erfolgreich');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('authToken');
    }
}
