import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import * as $ from 'jquery';
import { slideInAnimation } from 'src/styles/animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        slideInAnimation
        // animation triggers go here
    ]
})
export class AppComponent implements OnInit {
    title = 'GitHub NgSearch';
    theme = 'light-theme';
    isMobile = false;

    searchTerm = '';
    searchTimer;

    constructor(private router: Router) { }

    ngOnInit() {
        window.addEventListener('resize', this.checkIsMobile);
        this.checkIsMobile();

        // Events to auto-control expandable menus without further html code
        document.querySelectorAll('.expandable-menu').forEach(element => {
            element.querySelector('button').addEventListener('click', ev => {
                ev.stopPropagation();
                const dropdown = element.querySelector('.dropdown');
                const input = dropdown.querySelector('input');
                this.closeAllExpandableMenus(dropdown);
                $(dropdown).slideToggle();

                if (input !== null) {
                    input.focus();
                }
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown').forEach(element => {
                if (this.isMobile || !element.parentElement.classList.contains('only-mobile')) {
                    this.closeAllExpandableMenus();
                }
            });
        });

        document.querySelectorAll('.dropdown').forEach(element => {
            element.addEventListener('click', ev => {
                ev.stopPropagation();
            });
        });
    }

    /**
     * Navigate to search view
     */
    search() {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            this.router.navigateByUrl('user-search/' + this.searchTerm);
        }, 500);
    }


    /* -- Theming Methods -- */
    switchTheme(event) {
        event.stopPropagation();
        if (event.target.matches('button')) {
            this.theme = event.target.getAttribute('data-theme');
        }
    }

    closeAllExpandableMenus(current = null) {
        let $elems = $('.expandable-menu');
        if (!this.isMobile) {
            $elems = $elems.not('.only-mobile');
        }
        $elems = $elems.find('.dropdown');
        if (current !== null) {
            $elems = $elems.not(current);
        }
        $elems.slideUp();
    }

    checkIsMobile() {
        this.isMobile = window.matchMedia('(max-width: 767px)').matches;
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }
}
