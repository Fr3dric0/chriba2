/**
 * Created by toma2 on 09.02.2017.
 */

export interface Project {
  _id: string;
  name: string;
  title: string;
  description: string;
  location?: string;
  url?: string;
  iconUrl: string;
  uploaded?: string;
  thumbnails?: {
    large?: string[];
    small?: string[];
  };
}
