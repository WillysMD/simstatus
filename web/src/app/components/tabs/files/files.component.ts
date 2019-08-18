import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../api/api.service';
import {MatDialog} from '@angular/material';
import {FileEditDialogComponent} from '../../dialogs/file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {FileInfo} from '../../../api/file-info.model';
import {Pak} from '../../../api/pak.model';
import {Save} from '../../../api/save.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.sass']
})
export class FilesComponent implements OnInit {

  files: FileInfo[];

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService,
              private editDialog: MatDialog,
              private confirmDialog: MatDialog) {
  }

  get type(): string {
    return this.activatedRoute.snapshot.data.fileType;
  }

  get title(): string {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1) + 's';
  }

  private list(): void {
    this.apiService.filesList(this.type).subscribe({
      next: files => this.files = files,
      complete: () => this.files.sort()
    });
  }

  openCreateDialog(): void {
    const newFile = this.type === 'pak' ? new Pak() : new Save();
    const createDialogRef = this.editDialog.open(FileEditDialogComponent, {
      data: {file: newFile, list: this.files}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.apiService.filePost(data, this.type).subscribe({
          next: file => this.files.push(file),
          complete: () => this.files.sort()
        });
      }
    });
  }

  deleteConfirmDialog(file: FileInfo, prompt: string): void {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this.apiService.delete(file).subscribe({
          complete: () => this.files.splice(this.files.indexOf(file), 1)
        });
      }
    });
  }

  ngOnInit(): void {
    this.list();
  }
}
