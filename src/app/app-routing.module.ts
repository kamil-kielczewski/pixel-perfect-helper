import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsManagerComponent } from './layoutsManager/layoutsManager.component';
import { LayoutsViewerComponent } from './layoutsViewer/layoutsViewer.component';

const routes: Routes = [
  { path: '', component: LayoutsManagerComponent },
  { path: 'view/:id', component: LayoutsViewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
