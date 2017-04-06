/**
 * Created by toma2 on 09.02.2017.
 */

export interface Project {
    _id?: string; // Assigned by server
    name?: string; // Assigned by server
    title?: string;
    description?: string;
    url?: string;
    uploaded?: string;
    thumbnails?: {
        large?: string[];
        small?: string[];
    };
}
