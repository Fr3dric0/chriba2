import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GeocodeService {
    path: string = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    key: string;

    constructor(private http: Http) {
    }

    localize(location): Promise<{ lat?: number, long?: number }> {
        return new Promise((rsv, rr) => {
            const fields = ['address', 'postalCode', 'city']; // Required to get any results
            const address = {};

            if (!location) {
                return rsv({});
            }

            for (let i in fields) {
                const key = fields[i];

                if (!location[key]) {
                    return rsv({});
                }
            }

            const loc = this.serializeAddress(location);

            const url = `${this.path}${loc}${this.key ? '&key=' + this.key : ''}`;

            this.http.get(url).map(res => res.json()).subscribe(
                (response) => {
                    // Catch errors
                    if (response.status !== 'OK') {
                        return rr(response);
                    }

                    // Catch bad responses
                    if (!response || response.results.length < 1) {
                        return rsv({});
                    }

                    const {geometry} = response.results[0];

                    if (!geometry) {
                        return rsv({});
                    }

                    const {lat, lng} = geometry.location;
                    return rsv({lat, long: lng});
                },
                err => rr(err));
        });
    }

    private serializeAddress(location) {
        let str = '';

        for (let prop in location) {
            if (typeof prop != 'string') {
                continue;
            }

            const loc = location[prop];

            if (loc && loc !== 0) {
                str += ',' + loc.split(' ').join('+');
            }
        }

        return str;
    }

}