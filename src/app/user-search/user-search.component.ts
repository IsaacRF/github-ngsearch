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

    constructor(
        private githubApiService: GithubApiService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        let _this = this;

        this.route.params.subscribe(routeParams => {
            let searchTerm = routeParams.searchTerm;
            if (searchTerm) {
                $('#users-list').fadeOut(400, () => {
                    $('.spinner-loader').fadeIn();
                    this.users = null;

                    this.githubApiService.searchUsers(searchTerm)
                        .subscribe(users => {
                            $('.spinner-loader').fadeOut(400, () => {
                                _this.users = users;
                                $('#users-list').fadeIn();
                            });
                        });
                });
            }
        });
    }
}
