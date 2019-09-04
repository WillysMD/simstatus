import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuconfComponent } from './simuconf.component';

describe('SimuconfComponent', () => {
  let component: SimuconfComponent;
  let fixture: ComponentFixture<SimuconfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimuconfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuconfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
