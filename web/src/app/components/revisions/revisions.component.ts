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

  /**
   * Update the list of revisions
   */
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
  private sort(by: string = 'r') {
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

  /**
   * Insert a revision and keep the array sorted
   * @param revision to insert
   * @return the index at which the revision was inserted
   */
  private insert(revision: Revision): number {
    this.revisions.push(revision);
    this.sort();
    return this.revisions.indexOf(revision);
  }

  openCreateDialog() {
    const createDialogRef = this._revisionDialog.open(RevisionEditDialogComponent, {
      data: {revision: {} as Revision, list: this.revisions}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        // Switch to spinner mode while the revision is compiling
        data.status = RevisionStatusCode.BUIDLING;
        const i = this.insert(data as Revision);

        this._apiService.revisionsPost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (response) => this.revisions[i] = response,
        });
      }
    });
  }

  deleteConfirmDialog(i: number, prompt: string) {
    const confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        // Switch to spinner mode while the revision is being deleted
        this.revisions[i].status = RevisionStatusCode.BUIDLING;
        this._apiService.revisionsDelete(this.revisions[i]).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.revisions.splice(i, 1)
        });
      }
    });
  }

  ngOnInit() {
    // Initialize the list
    this.list();
    // Auto refresh the list
    setInterval(() => {
      this.list();
    }, 10000);
  }
}
