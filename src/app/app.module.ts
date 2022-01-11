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
// import { CartListItemsComponent } from './cart-list-items/cart-list-items.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { environment } from 'src/environments/environment';
import { BaseUrlInterceptor } from './core/http/BaseUrlInterceptor';
import { LoginComponent } from './core/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtTokenInterceptor } from './core/http/JwtTokenInterceptor';
import { ConfirmationEmailComponent } from './core/confirmation-email/confirmation-email.component';
import { BaseCartItem, ShoppingCartModule } from 'ng-shopping-cart';
// import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
// import {
//   GoogleLoginProvider,
//   FacebookLoginProvider
// } from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgbCarouselConfig, NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { LoadingComponent } from './core/loading/loading.component';
import { LoadingInterceptor } from './core/http/LoadingInterceptor';
import { DialogOverlayComponent } from './core/dialog-overlay/dialog-overlay.component';
import { CommonProjectModule } from './common/common-project.module';
import { PortalModule } from '@angular/cdk/portal';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserEditComponent } from './user-edit/user-edit.component';

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
    ClipboardModule,
    NgbModule,
    NgbCarouselModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    CommonProjectModule,
    PortalModule
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
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           'clientId'
    //         )
    //       },
    //       {
    //         id: FacebookLoginProvider.PROVIDER_ID,
    //         provider: new FacebookLoginProvider('clientId')
    //       }
    //     ]
    //   } as SocialAuthServiceConfig
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary, config: NgbCarouselConfig) {
    library.addIconPacks(fas);
    config.interval = 0;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
    config.animation = false;
    config.showNavigationIndicators = true;
  }
}
