import { User } from './../model/User';
import { GithubApiService } from './../services/github-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'app-user-search',
    templateUrl: './user-search.component.html',
    styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
    users: User[];
    searchTerm: string;

    constructor(
        private githubApiService: GithubApiService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        const that = this;

        $('.card-container').hide();

        this.route.params.subscribe(routeParams => {
            this.searchTerm = routeParams.searchTerm;
            if (this.searchTerm) {
                $('.no-search').hide();

                $('.card-container').fadeOut(400, () => {
                    $('.spinner-loader').fadeIn();
                    this.users = null;

                    this.githubApiService.searchUsers(this.searchTerm)
                        .subscribe(users => {
                            $('.spinner-loader').fadeOut(400, () => {
                                if (that.searchTerm) {
                                    if (users.length > 0) {
                                        that.users = users;
                                    } else {
                                        that.users = null;
                                    }
                                    $('.card-container').fadeIn();
                                }
                            });
                        });
                });
            } else {
                $('.card-container').fadeOut(400, () => {
                    that.users = null;
                    $('.no-search').fadeIn();
                });
            }
        });
    }
}
