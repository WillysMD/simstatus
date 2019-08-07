import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionEditDialogComponent } from './revision-edit-dialog.component';

describe('RevisionEditDialogComponent', () => {
  let component: RevisionEditDialogComponent;
  let fixture: ComponentFixture<RevisionEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
