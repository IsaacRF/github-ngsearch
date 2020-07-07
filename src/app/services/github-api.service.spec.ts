import { HttpResponseUserDetails } from './../model/HttpResponseUserDetails';
import { UserDetails } from './../model/UserDetails';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GithubApiService } from './github-api.service';
import { User } from '../model/User';
import { HttpParams, HttpResponse } from '@angular/common/http';

describe('GithubApiService', () => {
    let injector: TestBed;
    let service: GithubApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GithubApiService]
        });
        injector = getTestBed();
        service = injector.inject(GithubApiService);
        httpMock = injector.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#search', () => {
        it('should return an Observable<User[]>', () => {
            service.searchUsers('IsaacRF')
                .subscribe(users => {
                    expect(users.length).toBe(1);
                });

            const req = httpMock.expectOne(`${service.apiUserEndpoint}?q=IsaacRF`);
            expect(req.request.url).toBe(service.apiUserEndpoint);

            req.flush({
                incomplete_results: false,
                items: [{}],
                total_count: 1
            });
        });
    });

    describe('#getUserDetails', () => {
        it('should return an Observable<UserDetails>', () => {
            const dummyUser: HttpResponseUserDetails =
                ({
                    login: 'IsaacRF',
                    name: 'Isaac R.F.',
                    avatar_url: 'https://avatars1.githubusercontent.com/u/2803925?v=4',
                    bio: 'Test bio',
                    company: 'Test company',
                    location: 'Location',
                    email: 'isaacrf239@gmail.com',
                    blog: 'https://isaacrf.com'}) as HttpResponseUserDetails;

            service.getUserDetails(dummyUser.login).subscribe(user => {
                expect(user.login).toEqual(dummyUser.login);
                expect(user.name).toEqual(dummyUser.name);
                expect(user.avatarUrl).toEqual(dummyUser.avatar_url);
                expect(user.bio).toEqual(dummyUser.bio);
                expect(user.company).toEqual(dummyUser.company);
                expect(user.location).toEqual(dummyUser.location);
                expect(user.email).toEqual(dummyUser.email);
                expect(user.blog).toEqual(dummyUser.blog);
            });

            const req = httpMock.expectOne(`${service.apiUserDetailsEndpoint}/${dummyUser.login}`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyUser);
        });
    });
});
