/**
 * A representation of a GitHub user
 */
export class User {
    login: string;
    avatar_url: string;

    constructor(login: string, avatar_url: string) {
        this.login = login;
        this.avatar_url = avatar_url;
    }
}