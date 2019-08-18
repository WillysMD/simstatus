import {Component, OnInit} from '@angular/core';
import {Simuconf} from '../../../api/simuconf.model';
import {ApiService} from '../../../api/api.service';

@Component({
  selector: 'app-simuconf',
  templateUrl: './simuconf.component.html',
  styleUrls: ['./simuconf.component.sass']
})
export class SimuconfComponent implements OnInit {

  configs: Simuconf[];
  selectedConfig: Simuconf;

  constructor(private apiService: ApiService) {
  }

  private list(): void {
    this.apiService.simuconfList().subscribe({
      next: configs => {
        this.configs = configs;
        this.selectedConfig = configs[0];
      }
    });
  }

  save(event): void {
    console.log(event);
  }

  ngOnInit(): void {
    this.list();
  }
}
