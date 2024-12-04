import { Routes } from '@angular/router';

import { ImpressumComponent } from './impressum/impressum.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrierungComponent } from './registrierung/registrierung.component';

export const routes: Routes = [
    { path: 'impressum', component: ImpressumComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registrierung', component: RegistrierungComponent}
];
