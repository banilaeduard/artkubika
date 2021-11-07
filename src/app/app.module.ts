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
import { UserDetailsComponent } from './user-details/user-details.component';
import { CartListItemsComponent } from './cart-list-items/cart-list-items.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ContextMenuComponent } from './core/context-menu/context-menu.component';
import { environment } from 'src/environments/environment';
import { BaseUrlInterceptor } from './core/http/BaseUrlInterceptor';
import { LoginComponent } from './core/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtTokenInterceptor } from './core/http/JwtTokenInterceptor';
import { ConfirmationEmailComponent } from './core/confirmation-email/confirmation-email.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    HomeComponent,
    UserDetailsComponent,
    CartListItemsComponent,
    UserProfileComponent,
    ContextMenuComponent,
    LoginComponent,
    ConfirmationEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgImageSliderModule,
    NgScrollbarModule,
    OverlayModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
