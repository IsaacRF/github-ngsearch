import { UserSearchComponent } from './user-search/user-search.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/user-search', pathMatch: 'full' },
    { path: 'user-search', component: UserSearchComponent },
    { path: 'user-search/:searchTerm', component: UserSearchComponent },
    { path: 'user-detail/:userLogin', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
