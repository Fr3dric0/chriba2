/**
 * Created by toma2 on 09.02.2017.
 */

export interface Estate {
  _id: string;
  name: string;
  description: string;
  size: string;
  url?: string;
  uploaded?: string;
  thumbnails?: {
    large?: string[];
    small?: string[];
  };
  
  location: {
    address: string;
    addressNumber: string;
    postalCode: string;
    city: string;
    country?: string;
  };
}
