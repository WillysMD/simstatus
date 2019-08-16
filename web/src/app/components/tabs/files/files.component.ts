import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../api/api.service';
import {MatDialog} from '@angular/material';
import {FileEditDialogComponent} from '../../dialogs/file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {FileInfo} from '../../../api/file-info.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.sass']
})
export class FilesComponent implements OnInit {

  files: FileInfo[];

  constructor(private _activatedRoute: ActivatedRoute,
              private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog) {
  }

  get type() {
    return this._activatedRoute.snapshot.data.fileType;
  }

  get title() {
    if (this.type === 'pak') {
      return 'Pak';
    } else if (this.type === 'save') {
      return 'Save';
    }
  }

  private list() {
    this._apiService.filesList(this.type).subscribe({
      next: paks => this.files = paks,
      complete: () => this.files.sort()
    });
  }

  openCreateDialog() {
    const createDialogRef = this._editDialog.open(FileEditDialogComponent, {
      data: {file: {} as FileInfo, list: this.files}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this._apiService.filePost(data, this.type).subscribe({
          next: (file) => this.files.push(file),
          complete: () => this.files.sort()
        });
      }
    });
  }

  deleteConfirmDialog(i: number, prompt: string) {
    const confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.delete(this.files[i]).subscribe({
          complete: () => this.files.splice(i, 1)
        });
      }
    });
  }

  ngOnInit() {
    this.list();
  }
}
