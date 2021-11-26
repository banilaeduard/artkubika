import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CommonProjectModule } from '../common/common-project.module';
import { UsersDetailsComponent } from './users-details/users-details.component';

const routes: Routes = [
    {
        path: '',
        component: UsersDetailsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        CommonProjectModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [UsersDetailsComponent]
})
export class AdminModule {
}