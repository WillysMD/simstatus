import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'simuhead-frontend';

  activatedComponent: any;
  refreshButton: boolean;

  onRouteActivate(component) {
    this.activatedComponent = component;
    this.refreshButton = !!(component.refresh);
  }

  refresh() {
    this.activatedComponent.refresh();
  }
}
