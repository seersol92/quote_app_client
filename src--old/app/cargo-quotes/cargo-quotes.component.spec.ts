import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoQuotesComponent } from './cargo-quotes.component';

describe('CargoQuotesComponent', () => {
  let component: CargoQuotesComponent;
  let fixture: ComponentFixture<CargoQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
