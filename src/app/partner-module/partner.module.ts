import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonProjectModule } from '../common/common-project.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReclamatiiComponent } from './reclamatii/reclamatii.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReclamatieComponent } from './reclamatie/reclamatie.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
  {
    path: '',
    component: ReclamatiiComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    CommonProjectModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonProjectModule,
    NgScrollbarModule,
    NgbPaginationModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [
    ReclamatiiComponent,
    ReclamatieComponent
  ],
})
export class PartnerModule { }
