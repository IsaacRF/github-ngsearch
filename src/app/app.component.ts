import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'GitHub NgSearch';
    theme = 'light-theme';
    isMobile = false;

    ngOnInit() {
        window.addEventListener('resize', this.checkIsMobile);
        this.checkIsMobile();
        let _this = this;

        document.querySelectorAll('.expandable-menu').forEach(element => {
            element.querySelector('button').addEventListener('click', ev => {
                ev.stopPropagation();
                let dropdown = element.querySelector('.dropdown');
                let input = dropdown.querySelector('input');
                _this.closeAllExpandableMenus(dropdown);
                $(dropdown).slideToggle();

                if (input !== null) {
                    input.focus();
                }
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown').forEach(element => {
                if ( this.isMobile || !element.parentElement.classList.contains('only-mobile') ) {
                    _this.closeAllExpandableMenus();
                }
            });
        });

        document.querySelectorAll('.dropdown').forEach(element => {
            element.addEventListener('click', ev => {
                ev.stopPropagation();
            });
        });
    }

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
}
