import { Injectable } from '@angular/core';
import { ProjectService } from "../../projects/projects.service";
import { EstateService } from "../../estates/estates.service";
import { Estate } from "../../models/estate";
import { Project } from "../../models/project";

@Injectable()
export class ThumbnailService {
  constructor(private ps: ProjectService,
              private es: EstateService) {
    
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
        }
        
        const [estates, projects] = data;
        const flattened = [...estates, ...projects];
    
        const shuffled = this.shuffleList(flattened.map((elem) => {
            const obj = <any>{};
            
            let elemImg = this.shuffleList(elem.thumbnails.large)[0];
            
            if (elem.thumbnails.large.length < 1) {
              elemImg = "";
            }
            
            obj.img = elemImg;
            obj.url = `/${typeof elem == 'Project' ? 'projects' : 'estates'}/${elem.name}`;
            obj.description = `
            ${elem.location.address}<br>
            ${elem.location.addressNumber}<br>`;
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
