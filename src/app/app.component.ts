import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routeSlideRightLeftAnimation, slideInOutAnimation } from 'src/styles/animations';
import { fromEvent, Subscription } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        routeSlideRightLeftAnimation,
        slideInOutAnimation
    ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    title = 'GitHub NgSearch';
    theme = 'light-theme';
    isMobile = false;
    resizeSubscription: Subscription;
    documentClickSubscription: Subscription;

    @ViewChild('searchBox') searchBox: ElementRef;

    /**
     * States for the different dropdown + button combos
     * true: open
     * false: closed
     */
    dropwdownStates: any = {
        theme: false,
        search: false
    };

    constructor(private router: Router) { }

    ngOnInit() {
        // Global Events
        this.resizeSubscription = fromEvent(window, 'resize')
            .pipe(
                debounceTime(100)
            )
            .subscribe(evt => {
                this.isMobile = this.checkIsMobile();
            });

        this.documentClickSubscription = fromEvent(document, 'click')
            .subscribe(evt => {
                // Close all open dropdown when clicking anywhere except inside a dropdown or its content
                if (!(evt.target as HTMLElement).parentElement?.className.toString().includes('dropdown')) {
                    this.closeAllDropdown();
                }
            });

        // First mobile-mode check call
        this.isMobile = this.checkIsMobile();
    }

    ngAfterViewInit() {
        // Apply events to native elements
        fromEvent(this.searchBox.nativeElement, 'input')
            .pipe(
                map((event: InputEvent) => (event.target as HTMLInputElement).value),
                // filter(Boolean),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((text: string) => {
                this.search(text);
            });

        this.closeAllDropdown();
    }

    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
        this.documentClickSubscription.unsubscribe();
    }

    /**
     * Returns true if app is in mobile mode
     */
    checkIsMobile() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    /**
     * Navigate to search view
     * @param searchTerm Term to search for
     */
    search(searchTerm: string) {
        this.router.navigateByUrl('user-search/' + searchTerm);
    }

    /**
     * Switches theme by selected one
     * @param event Trigger event
     */
    switchTheme(event) {
        event.stopPropagation();
        if (event.target.matches('button')) {
            this.theme = event.target.getAttribute('data-theme');
        }
    }

    /**
     * Prepares route for animations
     * @param outlet outlet to anime
     */
    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }

    /**
     * Toggles specified dropdown state
     * @param key dropdown key in dropwdownStates
     * @param event event that triggered the function
     */
    toggleDropdownState(key: string, event: Event) {
        event.stopPropagation();
        this.closeAllDropdown(key);
        this.dropwdownStates[key] = !this.dropwdownStates[key];
    }

    /**
     * Checks state for specified dropdown
     * @param key dropdown key in dropwdownStates
     * @param onlyMobile if dropdown is only mobile, state will be true if app is not in mobile state. This way
     * the dropdown content is always "open" on no-mobile mode
     */
    checkDropdownState(key: string, onlyMobile: boolean) {
        if (onlyMobile) {
            return (!this.isMobile || (this.isMobile) && this.dropwdownStates[key]);
        } else {
            return this.dropwdownStates[key];
        }
    }

    /**
     * Closes all expandable menus except the specified one (if any)
     * @param excludedDropdownKey Dropdown to exclude from global collapse
     */
    closeAllDropdown(excludedDropdownKey: string = null) {
        for (const key in this.dropwdownStates) {
            if (key !== excludedDropdownKey) {
                this.dropwdownStates[key] = false;
            }
        }
    }

    /**
     * Focus search box
     * @param event Animation event that triggered the focus
     */
    focusSearch(event: any) {
        if (event.toState) {
            this.searchBox.nativeElement.focus();
        }
    }
}
