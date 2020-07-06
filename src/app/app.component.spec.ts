import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [
                AppComponent
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it(`app title must be 'GitHub NgSearch'`, () => {
        expect(app.title).toEqual('GitHub NgSearch');
    });

    it('should render title and text should be the same as app title', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.toolbar span').textContent).toContain(app.title);
    });
});
