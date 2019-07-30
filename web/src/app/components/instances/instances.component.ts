import {Component, OnInit} from '@angular/core';
import {ApiService, errorMessage, Instance, InstanceStatusCode} from '../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {InstanceEditDialogComponent} from '../instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {

  instances: Instance[];
  InstanceStatusCode: any = InstanceStatusCode;

  constructor(private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  /**
   * Update the list of instances
   */
  private list() {
    this._apiService.instancesList().subscribe({
      error: err => {
        this._errorSnack.open(errorMessage(err), ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG);
      },
      next: instances => {
        // Get the pak and save infos for each instance
        for (let instance of instances) {
          this._apiService.addRevisionInfo(instance);
          this._apiService.addPakInfo(instance);
          this._apiService.addSaveInfo(instance);
        }
        this.instances = instances;
      },
      complete: () => this.sort('name')
    });
  }

  /**
   * Sort the instance list
   * @param by - Property of Instance to sort by
   */
  sort(by: string = 'name') {
    this.instances.sort((a, b) => {
      if (a[by] < b[by]) {
        return -1;
      } else if (a[by] > b[by]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  insert(instance: Instance): number {
    this.instances.push(instance);
    this.sort();
    return this.instances.indexOf(instance);
  }

  /**
   * Refresh list with visual cue
   */
  refresh() {
    this.instances = [];
    // TODO: add spinner
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
        this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG)
      },
      next: instance => this.instances[i].status = instance.status
    });
  }

  /**
   * Open the instance edit dialog with empty instance data
   */
  openCreateDialog() {
    let dialogRef = this._editDialog.open(InstanceEditDialogComponent, {data: <Instance>{}});
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        let instance = <Instance>data;
        // Set spinner mode while the server is installing
        instance.status = InstanceStatusCode.BUILDING;
        // Add the instance to the list and sort
        let i = this.insert(instance);

        // Send the new instance data to the server
        this._apiService.instancePost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (instance) => this.instances[i] = instance
        });
      }
    });
  }

  /**
   * Open the instance edit dialog with the data from the selected instance
   * @param i - instance array id to update
   */
  openEditDialog(i: number) {
    let dialogRef = this._editDialog.open(InstanceEditDialogComponent, {data: this.instances[i]});
    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        let instance = <Instance>data;
        // Switch to spinner mode while the server is installing
        instance.status = InstanceStatusCode.BUILDING;
        this.instances[i] = instance;

        // Send the changes to the server
        this._apiService.instancePut(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          next: (instance) => this.instances[i] = instance
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
    let confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {data: promt});
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

  ngOnInit() {
    // Initialize the list
    this.list();
  }
}
