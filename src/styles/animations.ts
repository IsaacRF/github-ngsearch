import { trigger, animate, animateChild, transition, group, style, query, state } from '@angular/animations';

export const routeSlideRightLeftAnimation =
    trigger('routeSlideRightLeftAnimation', [
        transition('UserSearchPage => UserDetailPage', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 60,
                    left: 16,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ]),
        transition('UserDetailPage => UserSearchPage', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 60,
                    left: 16,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '-100%' })
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '100%' }))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ])
    ]);

export const slideInOutAnimation =
    trigger('slideInOutAnimation', [
        state('true',
            style({
                display: 'block',
                'transform-origin': 'top'
            }),
        ),
        state('false',
            style({
                display: 'none',
                'transform-origin': 'top'
            })
        ),
        transition('false => true', [
            style({
                display: 'block',
                transform: 'scaleY(0)',
                'transform-origin': 'top'
            }),
            animate('400ms ease-in-out', style({ transform: 'scaleY(1)' }))
        ]),
        transition('true => false', [
            animate('400ms ease-in-out', style({ transform: 'scaleY(0)' }))
        ])
    ]);

export const fadeInOutDisplayAnimation =
    trigger('fadeInOutDisplayAnimation', [
        state('true',
            style({
                display: 'flex',
                opacity: 1,
            }),
        ),
        state('false',
            style({
                display: 'none',
                opacity: 0,
            }),
        ),
        transition('true => false', [animate('300ms ease-in-out'), style({ display: 'none' })]),
        transition('false => true', [style({ display: 'flex' }), animate('300ms ease-in-out')])
    ]);

export const fadeInOutAnimation =
    trigger('fadeInOutAnimation', [
        state('true',
            style({
                opacity: 1,
            }),
        ),
        state('false',
            style({
                opacity: 0,
            }),
        ),
        transition('* <=> *', animate('300ms ease-in-out')),
    ]);
