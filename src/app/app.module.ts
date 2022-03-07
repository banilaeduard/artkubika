import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { HomeComponent } from './home/home.component';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { environment } from 'src/environments/environment';
import { BaseUrlInterceptor } from './core/http/BaseUrlInterceptor';
import { LoginComponent } from './core/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtTokenInterceptor } from './core/http/JwtTokenInterceptor';
import { ConfirmationEmailComponent } from './core/confirmation-email/confirmation-email.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { LoadingComponent } from './core/loading/loading.component';
import { LoadingInterceptor } from './core/http/LoadingInterceptor';
import { DialogOverlayComponent } from './core/dialog-overlay/dialog-overlay.component';
import { PortalModule } from '@angular/cdk/portal';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonProjectModule } from './common/common-project.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminModule } from './admin-module/admin.module';
import { PartnerModule } from './partner-module/partner.module';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    HomeComponent,
    UserProfileComponent,
    LoginComponent,
    ConfirmationEmailComponent,
    ResetPasswordComponent,
    LoadingComponent,
    DialogOverlayComponent,
    UserRegistrationComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgScrollbarModule,
    OverlayModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    NgxNavbarModule,
    ClipboardModule,
    PortalModule,
    CommonProjectModule,
    AdminModule,
    PartnerModule
  ],
  providers: [
    { provide: "BASE_API_URL", useValue: environment.baseUrl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    String.prototype.hashCode = function () {
      var hash = 0, i, chr;
      if (this.length === 0) return hash;
      for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
  }
}
declare global {
  interface String {
    hashCode(): number;
    getUniqueId(): string;
  }
}

String.prototype.hashCode = () => {
  var d = String(this);
  var hash = 0, i, chr;
  if (d.length === 0) return hash;
  for (i = 0; i < d.length; i++) {
    chr = d.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

String.prototype.getUniqueId = () => {
  const stringArr = [];
  for (let i = 0; i < 4; i++) {
    // tslint:disable-next-line:no-bitwise
    const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    stringArr.push(S4);
  }
  return stringArr.join('-');
};

export { }
