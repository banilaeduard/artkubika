import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { FramwrapperComponent } from './common/framwrapper/framwrapper.component';
// import { CartListItemsComponent } from './cart-list-items/cart-list-items.component';
import { ConfirmationEmailComponent } from './core/confirmation-email/confirmation-email.component';
import { LoginComponent } from './core/login/login.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user', component: UserEditComponent },
  { path: 'register', component: UserRegistrationComponent },
  //{ path: 'cartitems', component: CartListItemsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirmationEmail', component: ConfirmationEmailComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin-module/admin.module').then(m => m.AdminModule),
    data: { roles: ['admin'] },
    canLoad: [AuthGuard],
  },
  {
    path: 'partner',
    loadChildren: () => import('./partner-module/partner.module').then(m => m.PartnerModule),
    data: { roles: ['partener', 'admin'] },
    canLoad: [AuthGuard],
  },
  {
    path: 'calendar',
    component: FramwrapperComponent,
    data: { roles: ['admin'], url: 'https://calendar.google.com/calendar/embed?src=reclamatii%40tehn.org&ctz=Europe%2FLondon' },
    canLoad: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
