import { Routes } from '@angular/router';
import { LayoutsManagerComponent } from './layoutsManager';
import { LayoutsViewerComponent } from './layoutsViewer/layoutsViewer.component';
import { Url } from './common';

export const ROUTES: Routes = [
  { path: '',      component: LayoutsManagerComponent },
  { path: Url.to('layoutsViewer', {id: ':id'}), component: LayoutsViewerComponent },
];
