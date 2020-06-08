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
        let _this = this;

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
                                if (_this.searchTerm) {
                                    if (users.length > 0) {
                                        _this.users = users;
                                    } else {
                                        _this.users = null;
                                    }
                                    $('.card-container').fadeIn();
                                }
                            });
                        });
                });
            } else {
                $('.card-container').fadeOut(400, () => {
                    _this.users = null;
                    $('.no-search').fadeIn();
                });
            }
        });
    }
}
