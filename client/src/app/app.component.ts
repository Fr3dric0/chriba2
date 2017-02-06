import { Component } from '@angular/core';
import { MapComponent } from './shared/map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Chriba';
  description = 'Chriba er et inverstorfirma.';
}
