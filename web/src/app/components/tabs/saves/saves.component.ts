import {Component, OnInit} from '@angular/core';
import {ApiService, FileInfo, sortFileInfo} from '../../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FileEditDialogComponent} from '../../dialogs/file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-saves',
  templateUrl: '../paks/paks.component.html',
  styleUrls: ['../paks/paks.component.sass']
})
export class SavesComponent implements OnInit {

  title: 'Save';
  files: FileInfo[];

  constructor(private _apiService: ApiService,
              private _fileDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.savesList().subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: saves => this.files = saves,
      complete: () => this.sort()
    });
  }

  /**
   * Sort the files list
   */
  sort() {
    this.files.sort(sortFileInfo);
  }

  openCreateDialog() {
    const createDialogRef = this._fileDialog.open(FileEditDialogComponent, {
      data: {file: {} as FileInfo, list: this.files}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this._apiService.savePost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (save) => this.files.push(save),
          complete: () => this.list()
        });
      }
    });
  }

  deleteConfirmDialog(i: number, prompt: string) {
    const confirmDialog = this._confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialog.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.saveDelete(this.files[i]).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.files.splice(i, 1)
        });
      }
    });
  }

  ngOnInit() {
    this.list();
  }
}
