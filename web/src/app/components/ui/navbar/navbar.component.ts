import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {

  @Input() refreshButton: boolean;
  @Output() doRefresh = new EventEmitter();

  public refresh(): void {
    this.doRefresh.emit();
  }
}
