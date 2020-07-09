import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSearchRoutingModule } from './user-search-routing.module';
import { UserSearchComponent } from './user-search.component';


@NgModule({
    declarations: [UserSearchComponent],
    imports: [
        CommonModule,
        UserSearchRoutingModule
    ]
})
export class UserSearchModule { }
