import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSearchComponent } from './user-search.component';

/* Route should be user-search for eager load to work. Leave it blank and set a
lazy load route in app-routing.module to enable lazy load */
const routes: Routes = [{ path: 'user-search', component: UserSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSearchRoutingModule { }
