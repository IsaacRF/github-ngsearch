import { UserSearchComponent } from './user-search/user-search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/user-search', pathMatch: 'full' },
    { path: 'user-search', component: UserSearchComponent },
    { path: 'user-search/:searchTerm', component: UserSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
