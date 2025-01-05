import { Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ImprintComponent } from './imprint/imprint.component';
import { ProductsComponent } from './products/products.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CustomerCheckComponent } from './customer-check/customer-check.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { OrderHistoryComponent } from './order-history/order-history.component';


export const routes: Routes = [
    { path: 'admin-dashboard', component: AdminDashboardComponent},
    { path: 'company-profile', component: CompanyProfileComponent},
    { path: 'confirmation', component: ConfirmationComponent},
    { path: 'customer-check', component: CustomerCheckComponent},
    { path: 'imprint', component: ImprintComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent},
    { path: 'order-history', component: OrderHistoryComponent},
    { path: 'payment-method', component: PaymentMethodComponent},
    { path: '', component: ProductsComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'shopping-cart', component: ShoppingCartComponent}
];
