import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';

@NgModule({
    declarations: [UserDetailComponent],
    imports: [
        CommonModule,
        UserDetailRoutingModule
    ]
})
export class UserDetailModule { }
