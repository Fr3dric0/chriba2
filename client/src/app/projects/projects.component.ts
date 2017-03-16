import { Component, OnInit } from '@angular/core';
import { Project } from "../models/project";
import { ProjectsService } from "./projects.service";
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  data: Project;
  constructor(private es: ProjectsService) {
  }

  ngOnInit() {
    this.es.find()
      .subscribe((d) => {this.data = d; console.log(d)}, (err) => {console.error(err)})
  }

}
