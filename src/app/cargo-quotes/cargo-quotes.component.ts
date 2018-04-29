import { Component, TemplateRef, Pipe, PipeTransform, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FileUtilService } from './../services/file.util.service';
import { Constants } from './../common/file.constants';
import * as moment from 'moment';



@Component({
  selector: 'app-cargo-quotes',
  templateUrl: './cargo-quotes.component.html',
  styleUrls: ['./cargo-quotes.component.css']
})
export class CargoQuotesComponent implements OnInit {
  public cargoQuoteId: number;
  modalRef: BsModalRef;
  cargoFrom: FormGroup;
  cargoModalTitleTxt: String = null;
  cargoModalSaveBtnTxt: String = null;
  messageClass: String = null;
  message: String = null;
  qoute: String = null;
  isEditForm: Boolean = false;
  formProcessing: Boolean = false;
  allowImport: Boolean = false;
  allowExport: Boolean = false;
  reverse: Boolean = false;
  userName: string = null;
  isAdmin: Boolean = false;
  key: String = 'status';
  csvRecords = [];
  cargoList = [] ;
  jsonQuote = [];
  market = ['US Gulf', 'Caribbean', 'Far East', 'Arabian Gulf', 'US West Coast',
  'Mediterranean', 'UK Continent', 'US East Coast', 'West Coast South America',
  'East Coast South America', 'West Coast Central America', 'East Coast Mexico'];
cargoStatus = ['Working', ' On Subs', 'Fixed', 'Withdrawn', 'Failed'];
  cargo = [];

ngOnInit() {
  const  userData = this.auth.getUserData();
  this.userName = userData.user.username;
  this.isAdmin  = userData.user.isadmin;
  }
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService,
    private _fileUtil: FileUtilService  ) {
    this.createForm();
    this.fetchCargo();
    this.market.sort();
    this.cargoStatus.sort();
   }

    // METHOD CALLED WHEN CSV FILE IS IMPORTED
  fileChangeListener($event): void {
    const text = [];
    const target = $event.target || $event.srcElement;
    const files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert('Please import valid .csv file.');
      }
    }
    const input = $event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      const csvData = reader.result;
      const csvRecordsArray = csvData.split(/\r\n|\n/);

      let headerLength = -1;
      if (Constants.isHeaderPresentFlag) {
        const headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length;
      }

      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
      headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
      if ( this.csvRecords == null || this.csvRecords.length === 0) {
        alert('No Records Found To Be Imported!!');
      } else {
        this.allowImport = true;
      }
    },
    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  }

  onImport () {
    this.formProcessing = true;
    this.csvRecords.shift(); // remove header
    this.csvRecords.pop(); // remove last row
    if ( this.csvRecords !== null || this.csvRecords.length > 0 ) {
      const data = {
        'imported_quotes': this.csvRecords,
        'imported_by': this.userName
      };
     // return false;
      this.auth.postRequest('/cargo-quote/import-quotes', data ).subscribe(res => {
      this.csvRecords = [];
      this.modalRef.hide();
      this.formProcessing = false;
      if (!res.success) {
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
    } else {
      alert('No Record Found To Be Imported!!');
    }
  }

  checkEmpty (data)  {
    if (typeof(data) === 'undefined' || data === null || typeof(data.length) === 'undefined') {
      return '';
    }
    return data;
  }

  getQuotesToJson () {
    const datePipe = new DatePipe('en-US');
    this.jsonQuote = [];
    if (this.cargoList !== null || this.cargoList.length > 0) {
      for (let i = 0; i < this.cargoList.length; i++) {
      this.jsonQuote.push({
        'No#' : (i + 1),
        cargo_status: this.cargoList[i].cargo_status,
        type: this.checkEmpty(this.cargoList[i].type),
        market: this.checkEmpty(this.cargoList[i].market),
        charterer: this.cargoList[i].charterer,
        broker: this.cargoList[i].broker,
        quantity: this.cargoList[i].quantity,
        grade: this.cargoList[i].grade,
        date1:  datePipe.transform(this.cargoList[i].date1, 'dd/MM/yyyy'),
        date2:  datePipe.transform(this.cargoList[i].date2, 'dd/MM/yyyy'),
        load: this.cargoList[i].load,
        discharge: this.cargoList[i].discharge,
        rate_type: this.cargoList[i].rate_type,
        rate: this.cargoList[i].rate,
        vessel: this.cargoList[i].vessel.replace(/"|'|,|/g, ''),
        remarks: this.cargoList[i].remarks.replace(/"|'|,|/g, ''),
       date_added: datePipe.transform(this.cargoList[i].dateadded, 'dd/MM/yyyy'),
        added_by: this.cargoList[i].added_by
      });
      }
      return this.jsonQuote;
    } else {
      alert('No Data Found To Be Exported!!');
    }
  }
  exportQuotes () {
    const date = new Date().toLocaleDateString();
    const csvData = this.ConvertToCSV(this.getQuotesToJson());
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'Cargo_quotes_' + date + '.csv';
    a.click();
  }

  ConvertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (var index in objArray[0]) {
        row += index + ',';
      }
    row = row.slice(0, -1);
    // append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = "";
        for (var index in array[i]) {
            if (line !== '') line += ','
            line += array[i][index];
        }
        str += line + "\r\n";
    }
    return str;
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
      this.allowExport = true;
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
      type: [null],
      cargo_status: [null],
      market: [null],
      charterer: [null, Validators.compose([
          Validators.required,
          Validators.maxLength(20)
        ])
      ],
      broker: [null, Validators.compose([
          Validators.required,
          Validators.maxLength(20)
        ])
      ],
      quantity: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])
      ],
      grade: [null, Validators.compose([
          Validators.required,
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
        type: this.cargoFrom.get('type').value,
        cargo_status: this.cargoFrom.get('cargo_status').value,
        market: this.cargoFrom.get('market').value,
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
        addedby: this.userName
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

  importQuote(template: string) {
    this.allowImport = false;
    this.csvRecords = [];
    this.modalRef = this.modalService.show(template);
  }
}
