import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselRegisterComponent } from './vessel-register.component';
import { ModalComponent } from './layout/common/modal.component';


describe('VesselRegisterComponent', () => {
  let component: VesselRegisterComponent;
  let fixture: ComponentFixture<VesselRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
