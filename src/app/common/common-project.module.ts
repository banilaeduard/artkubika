import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlaymenuComponent } from './overlaymenu/overlaymenu.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
    imports: [
        CommonModule,
        PortalModule,
        OverlayModule,
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
    ],
    exports: [OverlaymenuComponent, UserDetailsComponent],
    declarations: [OverlaymenuComponent, UserDetailsComponent]
})
export class CommonProjectModule {

}