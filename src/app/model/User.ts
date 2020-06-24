/**
 * A representation of a GitHub user
 */
export class User {
    login: string;
    avatarUrl: string;

    constructor(login: string, avatarUrl: string) {
        this.login = login;
        this.avatarUrl = avatarUrl;
    }
}
