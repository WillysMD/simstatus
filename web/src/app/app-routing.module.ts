import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InstancesComponent} from './components/tabs/instances/instances.component';
import {RevisionsComponent} from './components/tabs/revisions/revisions.component';
import {FilesComponent} from './components/tabs/files/files.component';
import {SimuconfComponent} from './components/tabs/simuconf/simuconf.component';


const routes: Routes = [
  {
    path: '',
    component: InstancesComponent,
    data: {
      title: 'Instances'
    }
  },
  {
    path: 'revisions',
    component: RevisionsComponent,
    data: {
      title: 'Revisions'
    }
  },
  {
    path: 'paks',
    component: FilesComponent,
    data: {
      title: 'Paks',
      fileType: 'pak'
    }
  },
  {
    path: 'saves',
    component: FilesComponent,
    data: {
      title: 'Saves',
      fileType: 'save'
    }
  },
  {
    path: 'simuconf',
    component: SimuconfComponent,
    data: {
      title: 'Simuconf'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
