import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Injectable()
export class ChribaTitleService {

    constructor(private titleService: Title) { }

    /**
     *
     * Generates a title in the following format:
     *      "<title>Root-title | Child-title</title>"
     * The _Root-title_ is what you set initially in your title-tag,
     * and the _Child-title_ is the parameter you provide to this function.
     *
     * @function: setTitle
     * @param:  {string}    title   The child title name
     * @return: {string}    The fully generated title
     * */
    setTitle(title: string = null): string {
        const fullTitle = this.titleService.getTitle();
        let [ rootTitle ] = fullTitle.split(' | ');

        // If no Root-title has been set in
        // index.html, we set a placeholder for the page
        if (!rootTitle) {
           rootTitle = '[No Title]';
        }

        let newTitle = `${rootTitle}`;

        // We only want to include the
        // bar ('|') char if title exists.
        if (title) {
            newTitle += ` | ${title}`;
        }

        this.titleService.setTitle(newTitle);
        return newTitle;
    }

    /**
     * Returns the current title
     * @return {string}
     * */
    getTitle(): string {
        return this.titleService.getTitle();
    }
}