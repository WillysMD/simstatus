import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {FileInfo} from '../../../api/file-info.model';

interface FileDialogData {
  file: FileInfo;
  list: FileInfo[];
}

@Component({
  selector: 'app-file-edit-dialog',
  templateUrl: './file-edit-dialog.component.html',
  styleUrls: ['./file-edit-dialog.component.sass']
})
export class FileEditDialogComponent {

  private edited = false;
  file: File;

  public fileForm = new FormGroup({
    name: new FormControl(this.data.file.name, [
      Validators.required,
      Validators.pattern('[a-zA-Z0-9\-_]+')
    ]),
    version: new FormControl(this.data.file.version, [
      Validators.required,
      Validators.pattern('[0-9](\.[0-9]+){0,2}[a-z]?')
    ]),
  });

  constructor(public dialogRef: MatDialogRef<FileEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FileDialogData,
              private dialog: MatDialog) {
    this.fileForm.valueChanges.subscribe(() => {
      this.edited = true;
      this.dialogRef.disableClose = true;
    });
  }

  public getFileName(): string {
    return this.file.name;
  }

  public onFileChange(files: FileList): void {
    this.file = files[0];
  }

  public isValid(): boolean {
    return this.file != null && this.fileForm.valid;
  }

  public closeConfirm(prompt: string): void {
    if (this.edited) {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {data: prompt});
      confirmDialogRef.afterClosed().subscribe((answer) => {
        if (answer) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  public save(): void {
    const fileData = new FormData();
    fileData.append('name', this.fileForm.value.name);
    fileData.append('version', this.fileForm.value.version);
    fileData.append('file', this.file);
    this.dialogRef.close(fileData);
  }
}
