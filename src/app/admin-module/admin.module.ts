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
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageAttributesComponent } from './manage-attributes/manage-attributes.component';

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
    }
];

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        CommonProjectModule,
        ClipboardModule,
        FormsModule,
        NgbPaginationModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [UsersDetailsComponent, EditRolesComponent, ManageCodesComponent, ManageAttributesComponent]
})
export class AdminModule {
}