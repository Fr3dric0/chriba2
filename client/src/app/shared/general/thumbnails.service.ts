import { Injectable } from '@angular/core';
import { ProjectService } from "../../projects/projects.service";
import { EstateService } from "../../estates/estates.service";

@Injectable()
export class ThumbnailService {
  constructor(private ps: ProjectService,
              private es: EstateService) {
    
  }
  
  /**
   * data is a list of two list where each of the two lists
   * contains all data from estates and projects respectively:
   * [[estates data], [projects data]]
   */
  generate() {
    Promise.all([,
      this.es.findWithPromise(),
      this.ps.findWithPromise()
    ]).then((data) => {
      const [estates, projects] = data;
      const flattened = [...estates, ...projects];
    
      const shuffled = this.shuffleList(flattened.map((elem) => {
          const obj = <any>{};
          obj.img = this.shuffleList(elem.thumbnails.large)[0];
          obj.url = `/${typeof elem == 'Project' ? 'projects' : 'estates'}/${elem.name}`;
          obj.description = elem.description;
          return obj;
        })
      );
      
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
