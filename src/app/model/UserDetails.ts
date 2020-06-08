/**
 * A representation of a GitHub user with detailed info
 */
export class UserDetails {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    company: string;
    location: string;
    email: string;
    blog: string;

    /**
     * Base constructor
     * @param login User login name
     * @param name User name
     * @param avatar_url User avatar URL
     * @param bio User bio description
     * @param company User company
     * @param location User location
     * @param email User email
     * @param blog User website or blog URL
     */
    constructor(login: string, name: string, avatar_url: string, bio: string, company: string, location: string, email: string, blog: string) {
        this.login = login;
        this.name = name;
        this.avatar_url = avatar_url;
        this.bio = bio;
        this.company = company;
        this.location = location;
        this.email = email;
        this.blog = blog;
    }
}