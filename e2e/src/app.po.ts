import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getTitleText(): Promise<string> {
        return element(by.css('app-root .content span')).getText() as Promise<string>;
    }

    getWelcomeMessage(): Promise<string> {
        return element(by.css('app-root .content h2')).getText() as Promise<string>;
    }
}
