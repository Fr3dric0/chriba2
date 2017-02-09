/**
 * Created by toma2 on 09.02.2017.
 */

export interface Projects {
  _id: string;
  name: string;
  title: string;
  about: string;
  url?: string;
  uploaded?: string;
  visits?: number;
  thumbnails: {
    large: string[];
    small?: string[];
  };
}
