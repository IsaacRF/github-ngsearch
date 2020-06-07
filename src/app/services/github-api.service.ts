import { User } from './../model/User';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GithubApiService {
    //NOTE: This token has no private permissions enabled, and is here only for increasing GitHub API call limits for testing purposes
    private oAuthToken = "bab492878a9cb241f70139aa3152dfecb263765b";
    private apiUserEndpoint = "https://api.github.com/search/users";

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
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.oAuthToken
            }),
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
