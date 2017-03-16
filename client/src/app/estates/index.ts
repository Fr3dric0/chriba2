import { EstatesService } from "./estates.service";
import { EstatesComponent } from './estates.component';
import { EstatesSubComponent } from "./estates.sub_component";

export const ESTATES_DECLARATIONS = [
  EstatesComponent,
  EstatesSubComponent
];

export const ESTATES_PROVIDERS = [
  EstatesService,
];
