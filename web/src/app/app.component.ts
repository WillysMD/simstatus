import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'simuhead-frontend';

  activatedComponent: any;

  onRouteActivate(component) {
    this.activatedComponent = component;
  }

  refresh() {
    if (this.activatedComponent.refresh) {
      this.activatedComponent.refresh();
    }
  }
}
