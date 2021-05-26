import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsManagerComponent } from './layoutsManager/layoutsManager.component';
import { ColorPickerComponent } from './layoutsViewer/colorPicker/colorPicker.component';
import { HintBoxComponent } from './layoutsViewer/hintBox/hintBox.component';
import { LayoutsViewerComponent } from './layoutsViewer/layoutsViewer.component';
import { SelectionBoxComponent } from './layoutsViewer/selectionBox/selectionBox.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutsViewerComponent,
    LayoutsManagerComponent,
    ColorPickerComponent,
    HintBoxComponent,
    SelectionBoxComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
