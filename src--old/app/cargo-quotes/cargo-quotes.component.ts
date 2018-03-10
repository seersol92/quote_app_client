import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cargo-quotes',
  templateUrl: './cargo-quotes.component.html',
  styleUrls: ['./cargo-quotes.component.css']
})
export class CargoQuotesComponent  {
  modalRef: BsModalRef;
  cargoFrom: FormGroup;
  messageClass: String = null;
  message: String = null;
  cargoList = [] ;
  formProcessing: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.createForm();
    this.fetchCargo();
   }

  key: String = 'status';
  reverse: Boolean = false;
  sort(key) {
    console.log(key);
    this.key = key;
    this.reverse = !this.reverse;
  }

   fetchCargo() {
    this.auth.getRequest('/cargo-quote', null ).subscribe(res => {
      this.cargoList = res.data;
      console.log(this.cargoList);
    });
  }

  createForm() {
    this.cargoFrom = this.fb.group({
      status: [null, Validators.compose([
          Validators.required
        ])
      ],
      charterer: [null, Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ],
      broker: [null, Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ],
      quantity: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])
      ],
      grade: [null, Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20)
        ])
    ],
      date1: [null, Validators.compose([
          Validators.required
        ])
      ],
      date2: [null, Validators.compose([
          Validators.required
        ])
      ],
      load: [null, Validators.compose([
          Validators.required
        ])
      ],
      discharge: [null, Validators.compose([
          Validators.required
        ])
      ],
      rate_type: [null, Validators.compose([
          Validators.required
        ])
      ],
      rate: [null, Validators.compose([
          Validators.required
        ])
      ],
      vessel: [null, Validators.compose([
          Validators.required
        ])
      ],
      remarks: [null, Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])
      ]
      });
  }

  create() {
    this.formProcessing = true;
    const data = {
        cargo_status: this.cargoFrom.get('status').value,
        charterer: this.cargoFrom.get('charterer').value,
        broker: this.cargoFrom.get('broker').value,
        grade:  this.cargoFrom.get('grade').value,
        quantity: this.cargoFrom.get('quantity').value,
        date1: this.cargoFrom.get('date1').value,
        date2: this.cargoFrom.get('date2').value,
        load: this.cargoFrom.get('load').value,
        discharge: this.cargoFrom.get('discharge').value,
        rate_type: this.cargoFrom.get('rate_type').value,
        rate: this.cargoFrom.get('rate').value,
        vessel: this.cargoFrom.get('vessel').value,
        remarks: this.cargoFrom.get('remarks').value
    };
    this.auth.postRequest('/cargo-quote/create', data ).subscribe(res => {
      this.modalRef.hide();
      if (!res.success) {
          this.formProcessing = false;
          this.messageClass = 'alert alert-danger';
          this.message = 'Something went wrong!!';
      }else {
          this.fetchCargo();
          this.messageClass = 'alert alert-success';
          this.message = 'New Cargo Quote Has Been Registered :)';
      }
      setTimeout(() => {
        this.messageClass = '';
        this.message = '';
      }, 10000);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
