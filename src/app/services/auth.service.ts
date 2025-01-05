import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;
    private user = { email: 'testuser@example.com', password: 'testpassword' };

constructor() { }

login(email: string, password: string) {
    if (email === this.user.email && password === this.user.password) {
        this.loggedIn = true;
    } else {
        console.log('Login fehlgeschlagen: ', this.loggedIn);
    }
}

logout() {
    this.loggedIn = false;
    console.log('Logout erfolgreich: ', this.loggedIn);
}

isLoggedIn(): boolean {
    return this.loggedIn;
}
}
