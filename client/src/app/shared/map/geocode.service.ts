import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GeocodeService {
    path: string = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    key: string;

    constructor(private http: Http) { }

    localize(location): Promise<{lat?:number, long?:number}> {
        return new Promise((rsv, rr) => {
            const loc = this.serializeAddress(location);

            const url = `${this.path}${loc}${this.key ? '&key=' + this.key : ''}`;

            this.http.get(url).map(res => res.json()).subscribe(
                (response) => {
                    // Catch errors
                    if (response.status !== 'OK') {
                        console.error(response);
                        return rr(response);
                    }

                    // Catch bad responses
                    if (!response || response.results.length < 1) {
                        return rsv({});
                    }

                    const { geometry } = response.results[0];

                    if (!geometry) {
                        return rsv({});
                    }

                    const { lat, lng } = geometry.location;
                    return rsv({ lat, long: lng });
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
            str += ',' + location[ prop ].split(' ').join('+');
        }


        return str;
    }

}