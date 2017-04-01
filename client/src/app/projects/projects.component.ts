import { Component, OnInit } from '@angular/core';
import { Project } from "../models/project";
import { ProjectsService } from "./projects.service";
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  data: Project[];
  constructor(private es: ProjectsService) {
  }

  ngOnInit() {
    this.es.find()
      .subscribe((d) => {this.data = d.map(parseInnerContent)}, (err) => {console.error(err)})
  }
}

function parseInnerContent(elem){
  elem.innerContent = `
    <h3>${elem.title}</h3>
    <p>${elem.description.length > 150? elem.description.substring(0, 147) + "...": elem.description}</p>`;
  return elem;
}
