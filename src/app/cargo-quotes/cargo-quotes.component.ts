import { Component, TemplateRef, Pipe, PipeTransform, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cargo-quotes',
  templateUrl: './cargo-quotes.component.html',
  styleUrls: ['./cargo-quotes.component.css']
})
export class CargoQuotesComponent implements OnInit {
  modalRef: BsModalRef;
  cargoFrom: FormGroup;
  isEditForm: Boolean = false;
  public cargoQuoteId: number;
  cargoModalTitleTxt: String = 'Create Cargo Quote';
  cargoModalSaveBtnTxt: String = 'Save Cargo';
  messageClass: String = null;
  message: String = null;
  qoute: String = '';
  charterer: String = 'test';
  cargoList = [] ;
  cargo = [];
  formProcessing: Boolean = false;
  fileReaded: any;
  key: String = 'status';
  reverse: Boolean = false;
  ngOnInit() {

  }
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.createForm();
    this.fetchCargo();
    this.auth.getloggedInInfo();
   }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  transform(value: string) {
     const datePipe = new DatePipe('en-US');
     value = datePipe.transform(value, 'yyyy-MM-dd');
     return value;
 }

  async fetchCargo() {
    await this.auth.getRequest('/cargo-quote', null ).subscribe(res => {
    if (!res.success) {
      this.formProcessing = false;
      this.messageClass = 'alert alert-danger';
      this.message = 'Something went wrong!!';
    } else {
      this.cargoList = res.data;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }
  createForm() {
    this.cargoFrom = this.fb.group({
      cargo_status: [null],
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

  createCargoModal(template) {
    this.cargoModalTitleTxt = 'Create Cargo Quote';
    this.cargoModalSaveBtnTxt = 'Save Cargo';
    this.cargo = [];
    this.isEditForm = false;
    this.modalRef = this.modalService.show(template);
  }

  getFormData() {
    const data = {
        cargo_status: this.cargoFrom.get('cargo_status').value,
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
        remarks: this.cargoFrom.get('remarks').value,
        addedby: this.auth.loggedinName
    };
    return data;
  }

  create() {
    this.formProcessing = true;
    this.auth.postRequest('/cargo-quote/create', this.getFormData() ).subscribe(res => {
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

  onEditCargo(cargoIndex: number, template) {
    this.cargo =  JSON.parse(JSON.stringify(this.cargoList[cargoIndex]));
    if (this.cargo) {
        this.cargo['date1'] = this.transform(this.cargo['date1']);
        this.cargo['date2'] = this.transform(this.cargo['date2']);
        this.cargoQuoteId = this.cargoList[cargoIndex]['_id'];
        this.cargoModalTitleTxt = 'Edit Cargo';
        this.cargoModalSaveBtnTxt = 'Update Cargo';
        this.isEditForm = true;
        this.modalRef = this.modalService.show(template);
    }
  }

  update () {
    try {
      if (this.cargoQuoteId) {
        const data = this.getFormData();
        data['cargo_id'] = this.cargoQuoteId;
        this.auth.postRequest('/cargo-quote/update', data ).subscribe(res => {
          this.modalRef.hide();
          if (!res.success) {
            this.formProcessing = false;
            this.messageClass = 'alert alert-danger';
            this.message = res.message;
          } else {
            this.fetchCargo();
            this.messageClass = 'alert alert-success';
            this.message = res.message;
          }
        setTimeout(() => {
          this.messageClass = '';
          this.message = '';
        }, 10000);
        });
      }
    } catch (e) {
      console.log('Error:', e);
    }
  }

  onRemoveCargo (cargoIndex: number) {
     this.cargoQuoteId = this.cargoList[cargoIndex]['_id'];
     if (this.cargoQuoteId) {
       if (confirm('Are you sure to delete this Cargo Quote?') ) {
          this.auth.postRequest('/cargo-quote/delete', {cargo_id: this.cargoQuoteId} ).subscribe(res => {
            if (!res.success) {
              this.formProcessing = false;
              this.messageClass = 'alert alert-danger';
              this.message = res.message;
            } else {
              this.cargoList.splice(cargoIndex, 1);
              this.messageClass = 'alert alert-success';
              this.message = res.message;
            }
          setTimeout(() => {
            this.messageClass = '';
            this.message = '';
          }, 10000);
          });
       }
     }
  }

  async onSubmitForm() {
    if (!this.isEditForm) {
      return this.create();
    } else {
      return this.update();
    }
  }

  convertFile(csv: any) {
    this.fileReaded = csv.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    reader.onload = (e) => {
    const csv: string = reader.result;
    const allTextLines = csv.split(/\r|\n|\r/);
    const headers = allTextLines[0].split(',');
    const lines = [];
    for (let i = 0; i < allTextLines.length; i++) {
    // split content based on comma
    const data = allTextLines[i].split(',');
    if (data.length === headers.length) {
      const tarr = [];
    for (let j = 0; j < headers.length; j++) {
    tarr.push(data[j]);
    }
    // log each row to see output
    console.log(tarr);
    lines.push(tarr);
    }
    }
    // all rows in the csv file
    console.log('>>>>>>>>>>>>>>>>>', lines);
    };
}
}
