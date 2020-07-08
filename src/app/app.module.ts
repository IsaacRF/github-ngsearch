import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { UserSearchComponent } from '@features/user-search/user-search.component';
import { UserDetailComponent } from '@features/user-detail/user-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        UserSearchComponent,
        UserDetailComponent
    ],
    imports: [
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
