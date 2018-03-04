import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoRegisterComponent } from './cargo-register.component';

describe('CargoRegisterComponent', () => {
  let component: CargoRegisterComponent;
  let fixture: ComponentFixture<CargoRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
