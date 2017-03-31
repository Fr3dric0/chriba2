import { Injectable } from '@angular/core';
import { ProjectsService } from "../../projects/projects.service";
import { EstatesService } from "../../estates/estates.service";
import { Estate } from "../../models/estate";
import { Project } from "../../models/project";

@Injectable()
export class ThumbnailService {
  constructor(private ps: ProjectsService,
              private es: EstatesService) {

  }

  /**
   * data is a list of two list where each of the two lists
   * contains all data from estates and projects respectively:
   * [[estates data], [projects data]]
   *
   * Creates new objects obj for each element in projects and estates and
   * applying img, url and description properties to each object in shuffled list
   */
  generate(): Promise<any> {
    return new Promise((rsv, rr) => {
      Promise.all([
        this.es.findWithPromise(),
        this.ps.findWithPromise()
      ]).then((data) => {

        if (!data || data.length < 1) {
          rsv([]);
          return;
        }

        const [estates, projects] = data;
        let flattened;
        if (estates && projects) {
          flattened = [...estates, ...projects];
        } else {
          flattened = [];
        }

        const shuffled = this.shuffleList(flattened.map((elem) => {
            const obj = <any>{};

            let img = this.shuffleList(elem.thumbnails.large)[0];

            if (elem.thumbnails.large.length < 1) {
              img = "";
            }

            obj.img = img;
            obj.url = `/${!elem.location ? 'projects' : 'estates'}/${elem.name}`;
            if (elem.location) {
              obj.description = `
              ${elem.location.address}<br>
              ${elem.location.addressNumber}<br>`;
            }
            obj.description = `${elem.description.substring(0, 60)}...`;
            return obj;
          }));
        rsv(shuffled);
      })

        .catch(err => rr(err));

    });
  }


  /**
   * @param imgList
   * @returns {any}
   * Shuffles imgArray, placing the objects in random order
   */
  shuffleList(imgList) {
    let i, j, temp;
    for (i = imgList.length; i; i--) {
      j = Math.floor(Math.random() * i);
      temp = imgList[i-1];
      imgList[i-1] = imgList[j];
      imgList[j] = temp;
    }
    return imgList;
  }

}
