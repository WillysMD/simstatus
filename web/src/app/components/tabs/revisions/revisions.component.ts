import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api/api.service';
import {MatDialog, Sort} from '@angular/material';
import {RevisionEditDialogComponent} from '../../dialogs/revision-edit-dialog/revision-edit-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {Revision, RevisionStatusCode} from '../../../api/revision.model';
import {sortByOptions} from '../../utils/sort';

@Component({
  selector: 'app-revisions',
  templateUrl: './revisions.component.html',
  styleUrls: ['./revisions.component.sass']
})
export class RevisionsComponent implements OnInit {

  public revisions: Revision[];
  // Small hack to access the enum in the template
  public RevisionStatusCode: any = RevisionStatusCode;
  private sortOptions: Sort = {active: 'r', direction: 'desc'};

  constructor(private apiService: ApiService,
              private editDialog: MatDialog,
              private confirmDialog: MatDialog) {
  }

  private list(): void {
    this.apiService.revisionsList().subscribe({
      next: revisions => this.revisions = revisions,
      complete: () => this.sort()
    });
  }

  private sort(): void {
    sortByOptions(this.revisions, this.sortOptions);
  }

  private insert(revision: Revision): void {
    this.revisions.push(revision);
    this.sort();
  }

  private replace(oldRevision: Revision, newRevision: Revision): void {
    this.revisions[this.revisions.indexOf(oldRevision)] = newRevision;
    this.sort();
  }

  public refresh(): void {
    this.revisions = [];
    this.list();
  }

  public build(revision: Revision): void {
    revision.status = RevisionStatusCode.BUIDLING;
    this.apiService.revisionBuild(revision.url).subscribe({
      next: response => this.replace(revision, response)
    });
  }

  public openCreateDialog(): void {
    const createDialogRef = this.editDialog.open(RevisionEditDialogComponent, {
      data: {revision: new Revision(), list: this.revisions}
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data) {
        // Switch to spinner mode while the revision is compiling
        data.status = RevisionStatusCode.BUIDLING;
        const newRevision = new Revision(data);
        this.insert(newRevision);

        this.apiService.revisionsPost(data).subscribe({
          next: response => this.replace(newRevision, response)
        });
      }
    });
  }

  public deleteConfirmDialog(revision: Revision, prompt: string): void {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {data: prompt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        // Switch to spinner mode while the revision is being deleted
        revision.status = RevisionStatusCode.BUIDLING;

        this.apiService.delete(revision).subscribe({
          complete: () => this.revisions.splice(this.revisions.indexOf(revision), 1)
        });
      }
    });
  }

  public onSortChange(sort: Sort): void {
    this.sortOptions = sort;
    this.sort();
  }

  public ngOnInit(): void {
    this.list();
    setInterval(() => {
      this.list();
    }, 10000);
  }
}
