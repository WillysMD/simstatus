import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('editor', {static: false}) editorEl: ElementRef;

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

  save(): void {
    this.selectedConfig.data = this.editorEl.nativeElement.innerText;

    this.apiService.patch(this.selectedConfig).subscribe({
      next: response => console.log(response)
    });
  }

  ngOnInit(): void {
    this.list();
  }
}
