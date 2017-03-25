import { Routes } from '@angular/router';
import { LayoutsManagerComponent } from './layoutsManager';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import { LayoutsViewerComponent } from './layoutsViewer/layoutsViewer.component';
import { Url } from './common';

export const ROUTES: Routes = [
  { path: '',      component: LayoutsManagerComponent },
  { path: Url.to('layoutsViewer', {id: ':id'}), component: LayoutsViewerComponent },
  // { path: 'home',  component: LayoutsManagerComponent },
  // { path: 'home',  component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'detail', loadChildren: './+detail#DetailModule'},
  // { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  // { path: '**',    component: NoContentComponent },
  // { path: '**',    component: LayoutsManagerComponent },
];
