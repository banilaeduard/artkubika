import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CommonProjectModule } from '../common/common-project.module';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { ManageCodesComponent } from './manage-codes/manage-codes.component';
import { FormsModule } from '@angular/forms';
import { ManageAttributesComponent } from './manage-attributes/manage-attributes.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ManageFiltersComponent } from './manage-filters/manage-filters.component';

const routes: Routes = [
    {
        path: '',
        component: UsersDetailsComponent
    },
    {
        path: 'managecodes',
        component: ManageCodesComponent
    },
    {
        path: 'manageattributes',
        component: ManageAttributesComponent
    },
    {
        path: 'managefilters',
        component: ManageFiltersComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        CommonProjectModule,
        ClipboardModule,
        FormsModule,
        NgxPaginationModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [UsersDetailsComponent, EditRolesComponent, ManageCodesComponent, ManageAttributesComponent, ManageFiltersComponent]
})
export class AdminModule {
}