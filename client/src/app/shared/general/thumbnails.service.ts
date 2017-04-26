import { Injectable } from '@angular/core';
import { ProjectsService } from "../../projects/projects.service";
import { EstatesService } from "../../estates/estates.service";

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
            obj.description = "";
  
            // Adds description only if it has images
            if (elem.thumbnails.large.length > 0) {
              obj.description = this.getDescription(elem, obj.url);
            }
            return obj;
          }));
        rsv(shuffled);
      })

        .catch(err => rr(err));

    });
  }
  
  /**
   * Returns description created depended of wether elem has location,
   * address or adressnumber. May also add elem.description as well.
   * The url is the link to the internal page for current elem.
   *
   * @param elem
   * @param url
   * @returns {any}
   */
  getDescription(elem, url) {
    let desc;
  
    // Adds header depending on wether the element has images and location or not
    if (elem.location) {
      if (elem.location.address && elem.location.addressNumber) {
        desc = `${elem.location.address} ${elem.location.addressNumber}
                    <button class="btn-flat" style="float:right; width: 12em;"
                    [routerLink]="${url}">Les mer
                    
                    <svg style="margin-left:1em;" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                      <path d="M22 34h4V22h-4v12zm2-30C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z"/>
                    </svg>
                    </button><br>`;
      
      } else if (elem.location.address) {
        desc = `${elem.location.address}<br>`
      }
    }
  
    /*
     // Adds description if the elem has
     if (elem.description) {
       desc += `${elem.description}`;
       let length = 200; // length of description
     
       // Shortens long description
       if (desc.length > length) {
        desc = `${desc.substring(0, length)}...`;
       }
     }
   
     */
    
    return desc;
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
