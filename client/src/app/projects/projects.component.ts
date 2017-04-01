import { Component, OnInit } from '@angular/core';
import { Project } from "../models/project";
import { ProjectsService } from "./projects.service";
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  data: Project;
  parsing_data: any;
  constructor(private es: ProjectsService) {
  }

  ngOnInit() {
    this.es.find()
      .subscribe((d) => {
        this.parsing_data = d;
        try {
          this.data = this.parsing_data.map(parseInnerContent);
        }
        catch (e){
          console.error(e);
        }
        this.data = this.parsing_data;
      }, (err) => {console.error(err)})
  }
}

function parseInnerContent(elem){
  elem.innerContent = `
    <h3>${elem.title}</h3>
    <p>${elem.description.length > 150? elem.description.substring(0, 147) + "...": elem.description}</p>`;
  return elem;
}
