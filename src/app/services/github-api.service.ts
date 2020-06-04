import { User } from './../model/User';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
    private oAuthToken="bab492878a9cb241f70139aa3152dfecb263765b";
    private apiUserEndpoint = "https://api.github.com/search/users/";

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
        let params = new HttpParams()
            .set('q', userName);

        return this.http.get<User[]>(this.apiUserEndpoint, {params})
            .pipe(
                tap(users => console.log(`retrieved ${users.length} users by search term ${userName}`)),
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
