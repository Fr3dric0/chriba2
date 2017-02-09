/**
 * Created by toma2 on 09.02.2017.
 */

export interface Estates {
  _id: string;
  name: string;
  about: string;
  size: string;
  url?: string;
  uploaded?: string;
  thumbnails: {
    large: string[];
    small?: string[];
  };
  
  location: {
    address: string;
    address_number: string;
    city: string;
    country?: string;
  };
}
