import { Routes } from '@angular/router';

import { ImprintComponent } from './imprint/imprint.component';
import { ProductsComponent } from './products/products.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CustomerCheckComponent } from './customer-check/customer-check.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ShippingPaymentComponent } from './shipping-payment/shipping-payment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CompanyAreaComponent } from './company-area/company-area.component';

export const routes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent},
    { path: 'company-area', component: CompanyAreaComponent},
    { path: 'confirmation', component: ConfirmationComponent},
    { path: 'customer-check', component: CustomerCheckComponent},
    { path: 'privacy', component: PrivacyComponent},
    { path: 'imprint', component: ImprintComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent},
    { path: 'order-history', component: OrderHistoryComponent},
    { path: 'payment-method', component: PaymentMethodComponent},
    { path: 'shipping-payment', component: ShippingPaymentComponent},
    { path: '', component: ProductsComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'shopping-cart', component: ShoppingCartComponent},
    { path: 'wishlist', component: WishlistComponent}
];
