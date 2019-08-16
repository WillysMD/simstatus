import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api/api.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.sass']
})
export class StatusBarComponent implements OnInit {

  loadAvg: string;

  constructor(private _apiService: ApiService) {
  }

  ngOnInit() {
    this._apiService.infoLoadAvg().subscribe({
      next: response => this.loadAvg = response
    });
  }
}
