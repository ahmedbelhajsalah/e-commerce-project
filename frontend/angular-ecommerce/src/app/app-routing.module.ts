import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import path from 'path';
import { combineLatest } from 'rxjs';

const routes: Routes = [
  {path:'search/:keyword', component: ProductListComponent},
  {path:'category/:id', component: ProductListComponent},
  {path:'products', component: ProductListComponent},
  {path: 'category', component:ProductListComponent},
  {path:'', redirectTo:'/products', pathMatch:'full'},
  {path:'**',redirectTo:'/products', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
