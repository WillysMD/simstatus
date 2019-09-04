import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';

const APP_TITLE = 'Simstatus';
const APP_VERSION = 'v1.0.0-beta1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  private activatedComponent: any;
  public refreshButton: boolean;
  public version = APP_VERSION;
  public title = 'simuhead-frontend';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private browserTitle: Title) {
  }

  refresh(): void {
    this.activatedComponent.refresh();
  }

  onRouteActivate(component): void {
    this.activatedComponent = component;
    this.refreshButton = !!(component.refresh);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((data) => {
      this.browserTitle.setTitle(APP_TITLE + ' - ' + data.title);
    });
  }
}
