import { fadeInOutAnimation, fadeInOutDisplayAnimation } from './../../styles/animations';
import { User } from './../model/User';
import { GithubApiService } from './../services/github-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss'],
    animations: [ fadeInOutAnimation, fadeInOutDisplayAnimation ]
})
export class UserSearchComponent implements OnInit {
    users: User[];
    searchTerm: string;
    isLoading = false;

    constructor(
        private githubApiService: GithubApiService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(routeParams => {
            this.searchTerm = routeParams.searchTerm;
            if (this.searchTerm) {
                this.isLoading = true;
                this.githubApiService.searchUsers(this.searchTerm)
                    .subscribe(users => {
                        if (this.searchTerm) {
                            if (users.length > 0) {
                                this.users = users;
                            } else {
                                this.users = null;
                            }

                            this.isLoading = false;
                        }
                    });
            } else {
                this.users = null;
            }
        });
    }

    alert(text: string) {
        alert(text);
    }
}
