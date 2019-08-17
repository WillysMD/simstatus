import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api/api.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.sass']
})
export class StatusBarComponent implements OnInit {

  public loadAvg: string;

  constructor(private apiService: ApiService) {
  }

  public ngOnInit(): void {
    this.apiService.infoLoadAvg().subscribe({
      next: response => this.loadAvg = response
    });
  }
}
