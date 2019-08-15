import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';

const BASE_TITLE = 'Simstatus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'simuhead-frontend';

  activatedComponent: any;
  refreshButton: boolean;

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _titleService: Title) {
  }

  onRouteActivate(component) {
    this.activatedComponent = component;
    this.refreshButton = !!(component.refresh);
  }

  refresh() {
    this.activatedComponent.refresh();
  }

  ngOnInit() {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this._activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((data) => {
      this._titleService.setTitle(BASE_TITLE + ' - ' + data.title);
    });
  }
}
