import { Routes } from '@angular/router';
import { Component } from '@angular/core';

import { ImprintComponent } from './imprint/imprint.component';
import { ProductsComponent } from './products/products.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CustomerCheckComponent } from './customer-check/customer-check.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent},
    { path: 'imprint', component: ImprintComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent},
    { path: 'logout', component: LogoutComponent},
    { path: 'products', component: ProductsComponent},
    { path: 'shopping-cart', component: ShoppingCartComponent},
    { path: 'customer-check', component: CustomerCheckComponent},
    { path: 'payment-method', component: PaymentMethodComponent},
    { path: 'confirmation', component: ConfirmationComponent}
];
