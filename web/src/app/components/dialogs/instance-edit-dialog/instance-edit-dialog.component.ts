import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ApiService} from '../../../api/api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';
import {Instance} from '../../../api/instance.model';
import {Revision} from '../../../api/revision.model';
import {Pak} from '../../../api/pak.model';
import {Save} from '../../../api/save.model';
import {FileInfo} from '../../../api/file-info.model';
import {forkJoin} from 'rxjs';

interface InstanceDialogData {
  edit: Instance;
  list: Instance[];
}

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.sass']
})
export class InstanceEditDialogComponent implements OnInit {

  private edited = false;

  public revisions: Revision[];
  public paks: Pak[];
  public saves: Save[];
  public instanceForm = new FormGroup({
    name: new FormControl(this.data.edit.name, [
      Validators.required,
      Validators.pattern('[a-zA-Z0-9\-_]+'),
      nameIsUnique(this.data)
    ]),
    port: new FormControl(this.data.edit.port, [
      Validators.required,
      Validators.pattern('[0-9]+'),
      portIsUnique(this.data)
    ]),
    revision: new FormControl(null, [
      Validators.required,
    ]),
    lang: new FormControl(this.data.edit.lang, [
      Validators.required,
      Validators.pattern('[a-z]{2}')
    ]),
    debug: new FormControl(this.data.edit.debug, [
      Validators.required,
      Validators.min(0),
      Validators.max(3)
    ]),
    pak: new FormControl(null, [
      Validators.required
    ]),
    savegame: new FormControl(null, [
      Validators.required
    ]),
    url: new FormControl(this.data.edit.url)
  });

  constructor(public dialogRef: MatDialogRef<InstanceEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InstanceDialogData,
              private apiService: ApiService,
              private dialog: MatDialog) {
  }

  public get nameControl(): AbstractControl {
    return this.instanceForm.get('name');
  }

  public get portControl(): AbstractControl {
    return this.instanceForm.get('port');
  }

  public closeConfirm(prompt: string): void {
    if (this.edited) {
      // If the content has been edited, open a confirm dialog before closing
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: prompt,
      });
      confirmDialogRef.afterClosed().subscribe(answer => {
        if (answer) {
          this.dialogRef.close();
        }
      });
    } else {
      // If not edit has been made, just close the dialog
      this.dialogRef.close();
    }
  }

  public openNewFileDialog(type: string): void {
    let newFile: FileInfo;
    let fileList: FileInfo[];

    if (type === 'pak') {
      newFile = new Pak();
      fileList = this.paks;
    } else if (type === 'save') {
      newFile = new Save();
      fileList = this.saves;
    } else {
      return;
    }
    const newFileDialogRef = this.dialog.open(FileEditDialogComponent, {
      data: {file: newFile, list: fileList}
    });
    newFileDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.apiService.filePost(data, type).subscribe({
          next: response => {
            fileList.push(response);
            if (type === 'pak') {
              this.instanceForm.patchValue({
                pak: response.id
              });
            } else if (type === 'save') {
              this.instanceForm.patchValue({
                savegame: response.id
              });
            }
          }
        });
      }
    });
  }

  public save(): void {
    const data = this.instanceForm.value;
    data.revision = searchArray(data.revision, this.revisions);
    data.pak = searchArray(data.pak, this.paks);
    data.savegame = searchArray(data.savegame, this.saves);

    this.dialogRef.close(data);
  }

  public ngOnInit(): void {
    if (this.data.edit.revision) {
      this.instanceForm.patchValue({
        revision: this.data.edit.revision.id
      });
    }

    if (this.data.edit.pak) {
      this.instanceForm.patchValue({
        pak: this.data.edit.pak.id
      });
    }

    if (this.data.edit.savegame) {
      this.instanceForm.patchValue({
        savegame: this.data.edit.savegame.id
      });
    }

    this.instanceForm.valueChanges.subscribe(() => {
      this.edited = true;
      this.dialogRef.disableClose = true;
    });

    forkJoin(
      this.apiService.revisionsList(),
      this.apiService.filesList('pak'),
      this.apiService.filesList('save')
    ).subscribe(([revisions, paks, saves]) => {
      this.revisions = revisions;
      this.paks = paks;
      this.saves = saves;
    });
  }
}

function nameIsUnique(data: InstanceDialogData): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (checkUnique(data, control, 'name')) {
      return {nameNotUnique: {value: control.value}};
    } else {
      return null;
    }
  };
}

function portIsUnique(data: InstanceDialogData): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (checkUnique(data, control, 'port')) {
      return {portNotUnique: {value: control.value}};
    } else {
      return null;
    }
  };
}

function checkUnique(data: InstanceDialogData, control: AbstractControl, field: string) {
  for (const instance of data.list) {
    if (instance.url !== data.edit.url && instance[field] === control.value) {
      return true;
    }
  }
  return false;
}

function searchArray(id: number, array: Revision[] | FileInfo[]): Revision | FileInfo | undefined {
  for (const element of array) {
    if (element.id === id) {
      return element;
    }
  }
  return undefined;
}
