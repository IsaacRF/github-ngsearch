/**
 * A representation of a GitHub repository
 */
export class Repo {
    name: string;
    description: string;
    html_url: string;

    /**
     * Base constructor
     * @param name User login name
     * @param description User avatar URL
     * @param html_url User name
     */
    constructor(name: string, description: string, html_url: string) {
        this.name = name;
        this.description = description;
        this.html_url = html_url;
    }
}