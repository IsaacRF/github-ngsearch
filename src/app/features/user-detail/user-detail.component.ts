import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService } from '@services/github-api.service';
import { UserDetails } from '@models/UserDetails';
import { User } from '@models/User';
import { Repo } from '@models/Repo';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    userLogin?: string | null;
    userDetails?: UserDetails | null;
    userFollowers?: User[] | null;
    userRepos?: Repo[] | null;

    constructor(
        private githubApiService: GithubApiService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(routeParams => {
            this.userLogin = routeParams.userLogin;

            this.githubApiService.getUserDetails(this.userLogin)
                .subscribe(userDetails => {
                    if (userDetails) {
                        this.userDetails = userDetails;
                    }
                });

            this.githubApiService.getUserRepos(this.userLogin)
                .subscribe(repos => {
                    if (repos) {
                        this.userRepos = repos;
                    }
                });

            this.githubApiService.getUserFollowers(this.userLogin)
                .subscribe(followers => {
                    if (followers) {
                        this.userFollowers = followers;
                    }
                });
        });
    }

}
