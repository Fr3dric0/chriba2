/**
 * Created by toma2 on 09.02.2017.
 */

export interface Estate {
    _id?: string;
    name?: string;
    description?: string;
    size?: string;
    url?: string;
    uploaded?: string;

    thumbnails?: {
        large?: string[];
        small?: string[];
    };

    location: {
        address: string;
        addressNumber?: string;
        postalCode?: string;
        city?: string;
        country?: string;
        lat?: number;
        long?: number;
    };
}

/**
 * In the time the server only support x-www-form-urlencoded
 * We have to use a normalizer to ensure
 * */
export function normalizeEstate(estate: Estate) {
    const location = ['address', 'addressNumber', 'postalCode', 'city', 'lat', 'long'];
    const e = estate;

    location.forEach((elem) => {
        e[elem] = estate.location[elem];
    });

    return e;
}
