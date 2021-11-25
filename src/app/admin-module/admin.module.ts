import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
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
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [UsersDetailsComponent]
})
export class AdminModule {

}