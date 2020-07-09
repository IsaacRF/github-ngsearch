import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '@models/User';
import { UserDetails } from '@models/UserDetails';
import { Repo } from '@models/Repo';
import { HttpResponseUsers } from '@models/HttpResponseUsers';
import { HttpResponseUserDetails } from '@models/HttpResponseUserDetails';
import { HttpResponseRepos } from '@models/HttpResponseRepos';
import { HttpResponseFollowers } from '@models/HttpResponseFollowers';

@Injectable({
    providedIn: 'root'
})
export class GithubApiService {
    // NOTE: This token has no private permissions enabled, and is here only for increasing GitHub API call limits for testing purposes
    private oAuthToken = 'bab492878a9cb241f70139aa3152dfecb263765b';
    public apiUserEndpoint = 'https://api.github.com/search/users';
    public apiUserDetailsEndpoint = 'https://api.github.com/users';

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `token ${this.oAuthToken}`
    });

    // [CACHE]
    private cache = require('memory-cache');
    private cacheEntryLifetimeMs = 3600000;
    private cacheFollowersKey = '/followers';
    private cacheReposKey = '/repos';

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

        return this.http.get<HttpResponseUsers>(this.apiUserEndpoint, httpOptions)
            .pipe(
                tap((response: HttpResponseUsers) => console.log(`retrieved ${response.total_count} users by search term ${userName}`)),
                map((response: HttpResponseUsers) => {
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
    getUserDetails(userLogin?: string | null): Observable<UserDetails> {
        const httpOptions = { headers: this.httpHeaders, observe: 'response' as const };

        const cachedDetails = this.cache.get(userLogin);
        if (cachedDetails) {
            // Custom API header to return error 304 in case data hasn't been modified based on a hash (ETag)
            const etag = cachedDetails.headers.get('ETag');
            httpOptions.headers = httpOptions.headers.append('If-None-Match', etag);
        }

        return this.http.get<HttpResponseUserDetails>(`${this.apiUserDetailsEndpoint}/${userLogin}`, httpOptions)
            .pipe(
                tap((response: HttpResponse<HttpResponseUserDetails>) => {
                    if (!response || !response.body) {
                        throw new Error('Response body is empty');
                    }

                    console.log(`[HTTP] retrieved details of ${userLogin} / id: ${response.body.id}`);

                    // Save cache
                    this.cache.put(userLogin, response, this.cacheEntryLifetimeMs,
                        (key: string, value: HttpResponse<HttpResponseUserDetails>) => {
                            console.log(`[--CACHE] User details cache ${key} has expired`);
                        });
                    console.log(`[++CACHE] Cached user details for ${userLogin}`);
                }),
                map((response: HttpResponse<HttpResponseUserDetails>) => {
                    if (!response || !response.body) {
                        throw new Error('Response body is empty');
                    }

                    return new UserDetails(response.body.login, response.body.name,
                        response.body.avatar_url, response.body.bio, response.body.company,
                        response.body.location, response.body.email, response.body.blog);
                }),
                catchError((err: HttpErrorResponse) => {
                    // Error 304: Not Modified -> Get info from Cache
                    if (err.status === 304) {
                        console.log(`[CACHE] retrieved details of ${userLogin}`);

                        return of(new UserDetails(cachedDetails.body.login, cachedDetails.body.name,
                            cachedDetails.body.avatar_url || cachedDetails.body.avatarUrl, cachedDetails.body.bio,
                            cachedDetails.body.company, cachedDetails.body.location, cachedDetails.body.email,
                            cachedDetails.body.blog));
                    } else {
                        return this.handleError('getUserDetails', []);
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
    getUserRepos(userLogin?: string | null): Observable<Repo[]> {
        const httpOptions = { headers: this.httpHeaders, observe: 'response' as const };

        const cachedRepos = this.cache.get(`${userLogin}${this.cacheReposKey}`);
        if (cachedRepos) {
            // Custom API header to return error 304 in case data hasn't been modified based on a hash (ETag)
            const etag = cachedRepos.headers.get('ETag');
            httpOptions.headers = httpOptions.headers.append('If-None-Match', etag);
        }

        return this.http.get<HttpResponseRepos[]>(`${this.apiUserDetailsEndpoint}/${userLogin}/repos`, httpOptions)
            .pipe(
                tap((response: HttpResponse<HttpResponseRepos[]>) => {
                    if (!response || !response.body) {
                        throw new Error('Response body is empty');
                    }

                    console.log(`[HTTP] retrieved ${response.body.length} repos from ${userLogin}`);

                    // Save cache
                    this.cache.put(`${userLogin}${this.cacheReposKey}`, response, this.cacheEntryLifetimeMs,
                        (key: string, value: HttpResponse<HttpResponseRepos[]>) => {
                            console.log(`[--CACHE] User repos cache ${key} has expired`);
                        });
                    console.log(`[++CACHE] Cached user repos for ${userLogin}`);
                }),
                map((response: HttpResponse<HttpResponseRepos[]>) => {
                    if (!response || !response.body) {
                        throw new Error('Response body is empty');
                    }

                    return response.body.map(repo => {
                        return new Repo(repo.name, repo.description, repo.html_url);
                    });
                }),
                catchError((err: HttpErrorResponse) => {
                    // Error 304: Not Modified -> Get info from Cache
                    if (err.status === 304) {
                        console.log(`[CACHE] retrieved ${cachedRepos.body.length} repos from ${userLogin}`);

                        return of(cachedRepos.body.map((repo: HttpResponseRepos) => {
                            return new Repo(repo.name, repo.description, repo.html_url);
                        }));
                    } else {
                        return this.handleError('getUserRepos', []);
                    }
                })
            );
    }

    /**
     * Retrieves GitHub user followers
     *
     * GET Http Call
     * @param userLogin User login name
     */
    getUserFollowers(userLogin?: string | null): Observable<User[]> {
        const httpOptions = { headers: this.httpHeaders, observe: 'response' as const };

        const cachedFollowers = this.cache.get(`${userLogin}${this.cacheFollowersKey}`);
        if (cachedFollowers) {
            // Custom API header to return error 304 in case data hasn't been modified based on a hash (ETag)
            const etag = cachedFollowers.headers.get('ETag');
            httpOptions.headers = httpOptions.headers.append('If-None-Match', etag);
        }

        return this.http.get<HttpResponseFollowers[]>(`${this.apiUserDetailsEndpoint}/${userLogin}/followers`, httpOptions)
            .pipe(
                tap((response: HttpResponse<HttpResponseFollowers[]>) => {
                    if (!response || !response.body) {
                        throw new Error('Response body is empty');
                    }

                    console.log(`[HTTP] retrieved ${response.body.length} followers from ${userLogin}`);

                    // Save cache
                    this.cache.put(`${userLogin}${this.cacheFollowersKey}`, response, this.cacheEntryLifetimeMs,
                        (key: string, value: HttpResponse<HttpResponseFollowers[]>) => {
                            console.log(`[--CACHE] User followers cache ${key} has expired`);
                        });
                    console.log(`[++CACHE] Cached user followers for ${userLogin}`);
                }),
                map((response: HttpResponse<HttpResponseFollowers[]>) => {
                    if (!response || !response.body) {
                        throw new Error('Response body is empty');
                    }

                    return response.body.map(user => {
                        return new User(user.login, user.avatar_url);
                    });
                }),
                catchError((err: HttpErrorResponse) => {
                    // Error 304: Not Modified -> Get info from Cache
                    if (err.status === 304) {
                        console.log(`[CACHE] retrieved ${cachedFollowers.body.length} followers from ${userLogin}`);

                        return of(cachedFollowers.body.map((user: HttpResponseFollowers) => {
                            return new User(user.login, user.avatar_url);
                        }));
                    } else {
                        return this.handleError('getUserFollowers', []);
                    }
                })
            );
    }

    /**
     * Handle Http errors
     * @param operation name of the operation that failed
     * @param result optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.error(error);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
