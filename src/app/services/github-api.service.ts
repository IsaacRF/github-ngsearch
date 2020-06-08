import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from './../model/User';
import { UserDetails } from '../model/UserDetails';
import { Repo } from '../model/Repo';

@Injectable({
    providedIn: 'root'
})
export class GithubApiService {
    //NOTE: This token has no private permissions enabled, and is here only for increasing GitHub API call limits for testing purposes
    private oAuthToken = "bab492878a9cb241f70139aa3152dfecb263765b";
    private apiUserEndpoint = "https://api.github.com/search/users";
    private apiUserDetailsEndpoint = "https://api.github.com/users";

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `token ${this.oAuthToken}`
    })

    //[CACHE]
    private cache = {};
    private cacheFollowersKey = "/followers";
    private cacheReposKey = "/repos";

    /**
     * Base service constructor
     * @param http Http cliente injection
     */
    constructor(private http: HttpClient) { }

    /**
     * Searchs for users containing specified search string in their login name.
     *
     * GET Http Call
     * @param userName Name search string. It can be a full login name or part of it
     * @returns Observable list of users matching the search string
     */
    searchUsers(userName: string): Observable<User[]> {
        const httpOptions = {
            headers: this.httpHeaders,
            params: new HttpParams().set('q', userName)
        };

        return this.http.get(this.apiUserEndpoint, httpOptions)
            .pipe(
                tap((response: any) => console.log(`retrieved ${response.total_count} users by search term ${userName}`)),
                map((response: any) => {
                    return response.items.map(user => {
                        return new User(user.login, user.avatar_url);
                    });
                }),
                catchError(this.handleError('searchUsers', []))
            );
    }

    /**
     * Retrieves GitHub user details
     *
     * GET Http Call
     * @param userLogin User login name
     */
    getUserDetails(userLogin: string): Observable<UserDetails> {
        let httpOptions = { headers: this.httpHeaders, observe: 'response' as const };

        let cachedDetails = this.cache[userLogin];
        if (cachedDetails) {
            //Custom API header to return error 304 in case data hasn't been modified based on a hash (ETag)
            let etag = cachedDetails.headers.get('ETag');
            httpOptions.headers = httpOptions.headers.append('If-None-Match', etag);
        }

        return this.http.get<UserDetails>(`${this.apiUserDetailsEndpoint}/${userLogin}`, httpOptions)
            .pipe(
                tap((response: any) => {
                    console.log(`[HTTP] retrieved details of ${userLogin} / id: ${response.body.id}`)

                    //Save cache
                    this.cache[userLogin] = response;
                    response = response.body;
                }),
                map((response: any) => response.body),
                catchError(err => {
                    //Error 304: Not Modified -> Get info from Cache
                    if (err.status == 304) {
                        console.log(`[CACHE] retrieved details of ${userLogin}`)
                        return of(cachedDetails.body);
                    } else {
                        this.handleError('getUserDetails', []);
                    }
                })
            );
    }

    /**
     * Retrieves GitHub user repos
     *
     * GET Http Call
     * @param userLogin User login name
     */
    getUserRepos(userLogin: string): Observable<Repo[]> {
        const httpOptions = { headers: this.httpHeaders };

        return this.http.get<Repo[]>(`${this.apiUserDetailsEndpoint}/${userLogin}/repos`, httpOptions)
            .pipe(
                tap((response: any) => console.log(`retrieved ${response.length} repos from ${userLogin}`)),
                catchError(this.handleError('getUserRepos', []))
            );
    }

    /**
     * Retrieves GitHub user followers
     *
     * GET Http Call
     * @param userLogin User login name
     */
    getUserFollowers(userLogin: string): Observable<User[]> {
        const httpOptions = { headers: this.httpHeaders };

        return this.http.get<User[]>(`${this.apiUserDetailsEndpoint}/${userLogin}/followers`, httpOptions)
            .pipe(
                tap((response: any) => console.log(`retrieved ${response.length} followers from ${userLogin}`)),
                catchError(this.handleError('getUserFollowers', []))
            );
    }

    /**
     * Handle Http errors
     * @param operation name of the operation that failed
     * @param result optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
