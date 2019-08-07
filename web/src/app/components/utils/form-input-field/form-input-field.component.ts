import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-form-input-field',
  templateUrl: './form-input-field.component.html',
  styleUrls: ['./form-input-field.component.sass']
})
export class FormInputFieldComponent implements OnInit {

  @Input() formControl: FormControl;
  @Input() label: string;
  @Input() type: string;
  @Input() hint: string;

  constructor() { }

  ngOnInit() {
  }
}
