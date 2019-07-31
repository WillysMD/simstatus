import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ApiService, Revision} from '../../api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

export interface RevisionData {
  revision: Revision;
  list: Revision[];
}

@Component({
  selector: 'app-revision-edit-dialog',
  templateUrl: './revision-edit-dialog.component.html',
  styleUrls: ['./revision-edit-dialog.component.sass']
})
export class RevisionEditDialogComponent implements OnInit {

  private edited = false;
  private latestRevision: number;
  private revisionForm = new FormGroup({
    r: new FormControl(this.data.revision.r, [
      Validators.required,
      Validators.min(8503),
      revisionIsUnique(this.data.list)
    ]),
    alias: new FormControl(this.data.revision.alias, [
      Validators.pattern('[0-9]{3}.[0-9](.[0-9])?')
    ])
  });

  constructor(public dialogRef: MatDialogRef<RevisionEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: RevisionData,
              private confirmDialog: MatDialog,
              private _apiService: ApiService) {
    this.revisionForm.valueChanges.subscribe(() => {
      this.edited = true;
      this.dialogRef.disableClose = true;
    });
  }

  /**
   * Check for edits and close the dialog
   */
  closeConfirm(prompt: string) {
    if (this.edited) {
      // If the content has been edited, open a confirm dialog before closing
      const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {data: prompt});
      confirmDialogRef.afterClosed().subscribe((answer) => {
        if (answer) {
          this.dialogRef.close();
        }
      });
    } else {
      // If not edit has been made, just close the dialog
      this.dialogRef.close();
    }
  }

  save() {
    this.dialogRef.close(this.revisionForm.value);
  }

  ngOnInit() {
    if (this.latestRevision === undefined) {
      this._apiService.revisionGetLatest().subscribe({
        next: latestRevision => this.latestRevision = latestRevision
      });
    }
  }
}

function revisionIsUnique(revisions: Revision[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    for (const revision of revisions) {
      if (revision.r === control.value) {
        return {revisionNotUnique: {value: control.value}};
      }
    }
    return null;
  };
}
