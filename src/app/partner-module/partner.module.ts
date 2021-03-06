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
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: ReclamatiiComponent
  },
  {
    path: 'reclamatie',
    component: ReclamatieComponent
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
    NgScrollbarModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [
    ReclamatiiComponent,
    ReclamatieComponent
  ],
})
export class PartnerModule { }
