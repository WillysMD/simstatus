import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ApiService, errorMessage, Instance, InstanceStatusCode} from '../../../api.service';
import {MatDialog, MatSnackBar, MatSort, Sort} from '@angular/material';
import {InstanceEditDialogComponent} from '../../dialogs/instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements AfterViewInit {

  instances: Instance[];
  InstanceStatusCode: any = InstanceStatusCode;

  private sortOptions = {active: 'name', direction: 'asc'};

  constructor(private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.instancesList().subscribe({
      error: err => {
        this._errorSnack.open(errorMessage(err), ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG);
      },
      next: instances => {
        // Get the file and save infos for each instance
        // TODO: reduce the number of requests by serializing the related models
        for (const instance of instances) {
          this.getRelatedInfos(instance);
        }
        this.instances = instances;
      },
      complete: () => this.sort()
    });
  }

  private sort() {
    if (this.sortOptions) {
      const col = this.sortOptions.active;
      const isAsc = this.sortOptions.direction === 'asc';

      this.instances.sort((a, b) => {
        return (a[col] < b[col] ? -1 : 1) * (isAsc ? 1 : -1);
      });
    }
  }

  /**
   * Add revision, file and save info to an instance
   * @param instance to udpate
   */
  private getRelatedInfos(instance) {
    this._apiService.addRevisionInfo(instance);
    this._apiService.addPakInfo(instance);
    this._apiService.addSaveInfo(instance);
  }


  /**
   * Insert a instance and keep the array sorted
   * @param instance to insert
   * @return the index at which the instance was inserted
   */
  private insert(instance: Instance): number {
    this.instances.push(instance);
    this.sort();
    return this.instances.indexOf(instance);
  }

  /**
   * Refresh list with visual cue
   */
  refresh() {
    this.instances = [];
    this.list();
  }

  /**
   * Send a request to install an instance
   * Show spinner while waiting for response
   * @param i - Instance array id
   */
  install(i: number) {
    this.instances[i].status = InstanceStatusCode.BUILDING;
    this._apiService.instanceInstall(this.instances[i]).subscribe({
      error: err => {
        this.instances[i].status = InstanceStatusCode.CREATED;
        this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG);
      },
      next: instance => this.instances[i].status = instance.status
    });
  }

  /**
   * Send a request to start an instance
   * Show spinner while waiting for response
   * @param i - Instance array id
   */
  start(i: number) {
    this.instances[i].status = InstanceStatusCode.BUILDING;
    this._apiService.instanceStart(this.instances[i]).subscribe({
      error: err => {
        this.instances[i].status = InstanceStatusCode.READY;
        this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG);
      },
      next: instance => this.instances[i].status = instance.status
    });
  }

  /**
   * Open the instance edit dialog with empty instance data
   */
  openCreateDialog() {
    const dialogRef = this._editDialog.open(InstanceEditDialogComponent, {
      data: {instance: {} as Instance, list: this.instances}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        // Set spinner mode while the server is installing
        data.status = InstanceStatusCode.BUILDING;
        const i = this.insert(data as Instance);

        // Send the new instance data to the server
        this._apiService.instancePost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (response) => {
            this.instances[i] = response;
            this.getRelatedInfos(this.instances[i]);
          }
        });
      }
    });
  }

  /**
   * Open the instance edit dialog with the data from the selected instance
   * @param i - instance array id to update
   */
  openEditDialog(i: number) {
    const dialogRef = this._editDialog.open(InstanceEditDialogComponent, {
      data: {instance: this.instances[i], list: this.instances}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        // Switch to spinner mode while the server is installing
        data.status = InstanceStatusCode.BUILDING;
        // Replace with edited instance and get revision, file and save infos
        this.instances[i] = data as Instance;
        this.getRelatedInfos(this.instances[i]);

        // Send the changes to the server
        this._apiService.instancePut(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (response) => {
            this.instances[i] = response;
            this.getRelatedInfos(this.instances[i]);
          }
        });
      }
    });
  }

  /**
   * Open confirm dialog and if yes send delete request to the API
   * @param instance - instance to delete
   * @param promt - delete confirm dialog text
   */
  deleteConfirmDialog(instance: Instance, promt: string) {
    const confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: promt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        // Switch to spinner mode while waiting for the server
        instance.status = InstanceStatusCode.BUILDING;

        // Send a delete request to the server
        this._apiService.instanceDelete(instance).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.instances.splice(this.instances.indexOf(instance), 1)
        });
      }
    });
  }

  onSortChange(sortOptions: Sort) {
    this.sortOptions = sortOptions;
    this.sort();
  }

  ngAfterViewInit() {
    this.list();
    // Auto refresh the list
    setInterval(() => {
      this.list();
    }, 10000);
  }
}
