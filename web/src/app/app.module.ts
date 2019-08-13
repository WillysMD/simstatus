import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule, MatCheckboxModule,
  MatDialogModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule, MatSortModule,
  MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {InstancesComponent} from './components/tabs/instances/instances.component';
import {NavbarComponent} from './components/ui/navbar/navbar.component';
import {InstanceEditDialogComponent} from './components/dialogs/instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from './components/dialogs/confirm-dialog/confirm-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FileEditDialogComponent} from './components/dialogs/file-edit-dialog/file-edit-dialog.component';
import {RevisionsComponent} from './components/tabs/revisions/revisions.component';
import {RevisionEditDialogComponent} from './components/dialogs/revision-edit-dialog/revision-edit-dialog.component';
import {StatusBarComponent} from './components/ui/status-bar/status-bar.component';
import {FormInputFieldComponent} from './components/utils/form-input-field/form-input-field.component';
import {FilesComponent} from './components/tabs/files/files.component';

@NgModule({
  declarations: [
    AppComponent,
    InstancesComponent,
    NavbarComponent,
    InstanceEditDialogComponent,
    ConfirmDialogComponent,
    FileEditDialogComponent,
    RevisionsComponent,
    RevisionEditDialogComponent,
    StatusBarComponent,
    FormInputFieldComponent,
    FilesComponent,
  ],
  entryComponents: [
    InstanceEditDialogComponent,
    FileEditDialogComponent,
    ConfirmDialogComponent,
    RevisionEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
  exports: [],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        width: 'auto',
        autoFocus: false,
        hasBackdrop: true,
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
