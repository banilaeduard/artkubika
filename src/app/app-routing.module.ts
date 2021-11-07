import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartListItemsComponent } from './cart-list-items/cart-list-items.component';
import { ConfirmationEmailComponent } from './core/confirmation-email/confirmation-email.component';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './home/home.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user', component: UserDetailsComponent },
  { path: 'cartitems', component: CartListItemsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirmationEmail', component: ConfirmationEmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
