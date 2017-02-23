
export interface About {
  title: string;
  description: string;
  location: {
    address: string;
    addressNumber: string;
    postalCode: string;
    city: string;
    country?: string;
  }
  mobile: string;
  business?: string;
  email: string;
  mailbox?: string;
  
}
