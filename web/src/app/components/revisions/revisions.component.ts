import {Component, OnInit} from '@angular/core';
import {ApiService, errorMessage, Revision, RevisionStatusCode} from '../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RevisionEditDialogComponent} from '../revision-edit-dialog/revision-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-revisions',
  templateUrl: './revisions.component.html',
  styleUrls: ['./revisions.component.sass']
})
export class RevisionsComponent implements OnInit {

  revisions: Revision[];
  RevisionStatusCode: any = RevisionStatusCode;

  constructor(private _apiService: ApiService,
              private _revisionDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.revisionsList().subscribe({
      error: err => this._errorSnack.open(errorMessage(err), ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: (revisions) => this.revisions = revisions,
      complete: () => this.sort()
    });
  }

  /**
   * Sort the revisions list
   * @param by - Property of Revision to sort by
   */
  sort(by: string = 'r') {
    this.revisions.sort((a, b) => {
      if (a[by] < b[by]) {
        return -1;
      } else if (a[by] > b[by]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  insert(revision: Revision): number {
    this.revisions.push(revision);
    this.sort();
    return this.revisions.indexOf(revision);
  }

  openCreateDialog() {
    let createDialogRef = this._revisionDialog.open(RevisionEditDialogComponent, {
      data: {revision: <Revision>{}, list: this.revisions}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if(data) {
        data.status = RevisionStatusCode.BUIDLING;
        let i = this.insert(<Revision>data);

        this._apiService.revisionsPost(data).subscribe({
          error: err => this._errorSnack.open(errorMessage(err), ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (revision) => this.revisions[i] = revision,
        });
      }
    });
  }

  deleteConfirmDialog(revision: Revision, prompt: string) {
    let confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.revisionsDelete(revision).subscribe({
          error: err => this._errorSnack.open(errorMessage(err), ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.revisions.splice(this.revisions.indexOf(revision), 1)
        });
      }
    });
  }

  ngOnInit() {
    this.list();
  }
}
