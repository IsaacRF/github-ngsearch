import { UserSearchComponent } from '@features/user-search/user-search.component';
import { UserDetailComponent } from '@features/user-detail/user-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'user-search', pathMatch: 'full' },
    // Eager load paths
    { path: 'user-search', component: UserSearchComponent },
    { path: 'user-search/:searchTerm', component: UserSearchComponent, data: { animation: 'UserSearchPage' } },
    // Lazy load paths
    /*{
        path: 'user-search',
        loadChildren: () => import('./features/user-search/user-search.module').then(m => m.UserSearchModule),
        data: { animation: 'UserSearchPage' }
    },
    {
        path: 'user-search/:searchTerm',
        loadChildren: () => import('./features/user-search/user-search.module').then(m => m.UserSearchModule),
        data: { animation: 'UserSearchPage' }
    },*/
    {
        path: 'user-detail/:userLogin',
        loadChildren: () => import('./features/user-detail/user-detail.module').then(m => m.UserDetailModule),
        data: { animation: 'UserDetailPage' }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
