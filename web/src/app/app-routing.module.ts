import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InstancesComponent} from './components/instances/instances.component';
import {PaksComponent} from './components/paks/paks.component';
import {SavesComponent} from './components/saves/saves.component';
import {RevisionsComponent} from './components/revisions/revisions.component';


const routes: Routes = [
  {
    path: '',
    component: InstancesComponent,
  },
  {
    path: 'revisions',
    component: RevisionsComponent,
  },
  {
    path: 'paks',
    component: PaksComponent,
  },
  {
    path: 'saves',
    component: SavesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
