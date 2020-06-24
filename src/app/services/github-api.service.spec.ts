import { UserDetails } from './../model/UserDetails';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GithubApiService } from './github-api.service';
import { User } from '../model/User';
import { HttpParams } from '@angular/common/http';

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
        service = injector.get(GithubApiService);
        httpMock = injector.get(HttpTestingController);
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
            const dummyUser: UserDetails =
                new UserDetails(
                    'IsaacRF',
                    'Isaac R.F.',
                    'https://avatars1.githubusercontent.com/u/2803925?v=4',
                    'Test bio',
                    'Test company',
                    'Location',
                    'isaacrf239@gmail.com',
                    'https://isaacrf.com');

            service.getUserDetails(dummyUser.login).subscribe(user => {
                expect(user).toEqual(dummyUser);
            });

            const req = httpMock.expectOne(`${service.apiUserDetailsEndpoint}/${dummyUser.login}`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyUser);
        });
    });
});
