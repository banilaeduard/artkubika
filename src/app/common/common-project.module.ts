import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlaymenuComponent } from './overlaymenu/overlaymenu.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
    imports: [
        CommonModule,
        PortalModule,
        OverlayModule,
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        NgbDropdownModule,
        NgScrollbarModule
    ],
    exports: [OverlaymenuComponent, UserDetailsComponent, DropdownComponent],
    declarations: [OverlaymenuComponent, UserDetailsComponent, DropdownComponent]
})
export class CommonProjectModule {
}