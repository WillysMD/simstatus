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
  selector: 'app-paks',
  templateUrl: './paks.component.html',
  styleUrls: ['./paks.component.sass']
})
export class PaksComponent implements OnInit {

  title: 'Pak';
  files: FileInfo[];

  constructor(private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.paksList().subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: paks => this.files = paks,
      complete: () => this.sort()
    });
  }

  sort() {
    this.files.sort(sortFileInfo);
  }

  openCreateDialog() {
    const createDialogRef = this._editDialog.open(FileEditDialogComponent, {
      data: {file: {} as FileInfo, list: this.files}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this._apiService.pakPost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (pak) => this.files.push(pak),
          complete: () => this.sort()
        });
      }
    });
  }

  deleteConfirmDialog(i: number, prompt: string) {
    const confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.pakDelete(this.files[i]).subscribe({
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
