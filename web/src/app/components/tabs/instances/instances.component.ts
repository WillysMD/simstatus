import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api/api.service';
import {MatDialog, Sort} from '@angular/material';
import {InstanceEditDialogComponent} from '../../dialogs/instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {Instance, InstanceStatusCode} from 'src/app/api/instance.model';
import {sortByOptions} from '../../../utils/sort';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {

  instances: Instance[];
  // Small hack to access the enum in the template
  InstanceStatusCode: any = InstanceStatusCode;
  private sortOptions: Sort = {active: 'name', direction: 'asc'};

  constructor(private apiService: ApiService,
              private editDialog: MatDialog,
              private confirmDialog: MatDialog) {
  }

  private list(): void {
    this.apiService.instancesList().subscribe({
      next: instances => this.instances = instances,
      complete: () => this.sort()
    });
  }

  private sort(): void {
    sortByOptions(this.instances, this.sortOptions);
  }

  private insert(instance: Instance): void {
    this.instances.push(instance);
    this.sort();
  }

  private replace(oldInstance: Instance, newInstance: Instance): void {
    this.instances[this.instances.indexOf(oldInstance)] = newInstance;
    this.sort();
  }

  /**
   * Refresh list with visual cue
   */
  refresh(): void {
    this.instances = [];
    this.list();
  }

  install(instance: Instance): void {
    instance.status = InstanceStatusCode.WAITING;
    this.apiService.instanceInstall(instance).subscribe({
      next: response => this.replace(instance, response)
    });
  }

  start(instance: Instance): void {
    instance.status = InstanceStatusCode.WAITING;
    this.apiService.instanceStart(instance).subscribe({
      next: response => this.replace(instance, response)
    });
  }

  stop(instance: Instance): void {
    instance.status = InstanceStatusCode.WAITING;
    this.apiService.instanceStop(instance).subscribe({
      next: response => this.replace(instance, response)
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.editDialog.open(InstanceEditDialogComponent, {
      data: {edit: new Instance(), list: this.instances}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        // Set spinner mode while the server is installing
        data.status = InstanceStatusCode.WAITING;
        const newInstance = new Instance(data);
        this.insert(newInstance);

        this.apiService.instancePost(data).subscribe({
          next: response => this.replace(newInstance, response)
        });
      }
    });
  }

  openEditDialog(instance: Instance): void {
    const dialogRef = this.editDialog.open(InstanceEditDialogComponent, {
      data: {edit: instance, list: this.instances}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        // Switch to spinner mode while the server is installing
        data.status = InstanceStatusCode.WAITING;
        // Replace with edited instance
        const editedInstance = new Instance(data);
        this.replace(instance, editedInstance);

        this.apiService.put(data).subscribe({
          next: response => this.replace(editedInstance, response)
        });
      }
    });
  }

  deleteConfirmDialog(instance: Instance, promt: string): void {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {data: promt});
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        // Switch to spinner mode while waiting for the server
        instance.status = InstanceStatusCode.WAITING;
        // Send a delete request to the server
        this.apiService.delete(instance).subscribe({
          complete: () => this.instances.splice(this.instances.indexOf(instance), 1)
        });
      }
    });
  }

  onSortChange(sort: Sort): void {
    this.sortOptions = sort;
    this.sort();
  }

  ngOnInit(): void {
    this.list();
    // Auto refresh the list
    setInterval(() => {
      this.list();
    }, 10000);
  }
}
