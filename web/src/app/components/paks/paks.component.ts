import {Component, OnInit} from '@angular/core';
import {ApiService, FileInfo, sortFileInfo} from '../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

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

  paks: FileInfo[];

  constructor(private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.paksList().subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: paks => this.paks = paks,
      complete: () => this.sort()
    });
  }

  /**
   * Sort the paks list
   */
  sort() {
    this.paks.sort(sortFileInfo);
  }

  openCreateDialog() {
    let createDialogRef = this._editDialog.open(FileEditDialogComponent, {
      data: {file: <FileInfo>{}, list: this.paks}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this._apiService.pakPost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (pak) => this.paks.push(pak),
          complete: () => this.sort()
        });
      }
    });
  }

  deleteConfirmDialog(pak: FileInfo, prompt: string) {
    let confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.pakDelete(pak).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.paks.splice(this.paks.indexOf(pak), 1)
        });
      }
    });
  }

  ngOnInit() {
    this.list();
  }
}
