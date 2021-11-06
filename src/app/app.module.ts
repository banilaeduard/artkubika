import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { InputComponent } from './core/input/input.component';
import { ContextMenuComponent } from './core/context-menu/context-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    HomeComponent,
    UserDetailsComponent,
    CartListItemsComponent,
    UserProfileComponent,
    InputComponent,
    ContextMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgImageSliderModule,
    NgScrollbarModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
