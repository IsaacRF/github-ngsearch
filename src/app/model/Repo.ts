/**
 * A representation of a GitHub repository
 */
export class Repo {
    name: string;
    description: string;
    htmlUrl: string;

    /**
     * Base constructor
     * @param name Repo name
     * @param description Repo description
     * @param htmlUrl Repo URL
     */
    constructor(name: string, description: string, htmlUrl: string) {
        this.name = name;
        this.description = description;
        this.htmlUrl = htmlUrl;
    }
}
