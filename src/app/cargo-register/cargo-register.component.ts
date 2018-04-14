import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cargo-register',
  templateUrl: './cargo-register.component.html',
  styleUrls: ['./cargo-register.component.css']
})
export class CargoRegisterComponent  {
  modalRef: BsModalRef;
  cargoReg: FormGroup;
  messageClass: String = null;
  message: String = null;
  cargoRegisterId: String = null;
  cargoModalTitleTxt: String = '';
  cargoModalSaveBtnTxt: String = '';
  cargoList = [] ;
  cargo = [];
  isEditCargo: Boolean = false;
  formProcessing: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) { // <--- inject FormBuilder
    this.createForm();
    this.cargoFetch();
   }

   openModal(template: TemplateRef<any>) {
    this.cargoModalTitleTxt = 'Create Cargo Registry';
    this.cargoModalSaveBtnTxt = 'Save Cargo';
    this.cargoReg.reset();
    this.modalRef = this.modalService.show(template);
  }

  /**
   * REGX: ^[-_ a-zA-Z0-9]+$ allow alpha numeric _ - and space
   *
   */
  createForm() {
    this.cargoReg = this.fb.group({
      grade: [null, Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(20),
              Validators.pattern('(^[-_ a-zA-Z0-9]+$)')])
      ],
      des: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')])
      ],
      type: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('(^[-_ a-zA-Z0-9]+$)')])
      ]
    });
  }

  async cargoFetch() {
    await this.auth.getRequest('/cargo-register', null ).subscribe(res => {
    if (!res.success) {
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

  onCreate(data) {
    this.auth.postRequest('/cargo-register/create', data ).subscribe(res => {
    this.modalRef.hide();
    this.formProcessing = false;
    this.cargoReg.reset();
    if (!res.success) {
        this.messageClass = 'alert alert-danger';
        this.message = res.message;
    }else {
        this.cargoFetch();
        this.messageClass = 'alert alert-success';
        this.message = res.message;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
  });
}

  onUpdate (data) {
      this.auth.postRequest('/cargo-register/update', data ).subscribe(res => {
      this.modalRef.hide();
      this.formProcessing = false;
      this.isEditCargo = false;
      this.cargoRegisterId = null; // make id null
      this.cargoReg.reset(); // reset form
      if (!res.success) {
          this.messageClass = 'alert alert-danger';
          this.message = res.message;
      }else {
          this.cargoFetch();
          this.messageClass = 'alert alert-success';
          this.message = res.message;
      }
      setTimeout(() => {
        this.messageClass = '';
        this.message = '';
      }, 10000);
    });
  }

  onSubmit() {
  this.formProcessing = true;
  const data = {
    grade: this.cargoReg.get('grade').value,
    type: this.cargoReg.get('type').value,
    description: this.cargoReg.get('des').value
  };
  if (this.cargoRegisterId !== null && this.isEditCargo) {
      data['cargo_id'] = this.cargoRegisterId;
      this.onUpdate(data);
  } else {
      this.onCreate(data);
  }
  }

  onEditCargo(cargoIndex: number, template) {
    this.cargo =  JSON.parse(JSON.stringify(this.cargoList[cargoIndex]));
    if (this.cargo) {
        this.cargoRegisterId = this.cargoList[cargoIndex]['_id'];
        this.cargoModalTitleTxt = 'Edit Cargo';
        this.cargoModalSaveBtnTxt = 'Update Cargo';
        this.isEditCargo = true;
        this.cargoReg.patchValue({
          grade: this.cargo['grade'],
          des  : this.cargo['description'],
          type : this.cargo['type']
      });
      this.modalRef = this.modalService.show(template);
    }
  }

  onRemoveCargo(cargoIndex: number, cargoId: any) {
    this.cargoRegisterId = this.cargoList[cargoIndex]['_id'];
    if (this.cargoRegisterId) {
      if (confirm('Are you sure to delete this Cargo Registry?') ) {
         this.auth.postRequest('/cargo-register/delete', {cargo_id: this.cargoRegisterId} ).subscribe(res => {
           this.cargoRegisterId = null;
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
  }

