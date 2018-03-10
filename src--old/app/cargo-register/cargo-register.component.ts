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
  cargoList = [] ;
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
    this.modalRef = this.modalService.show(template);
  }

  createForm() {
    this.cargoReg = this.fb.group({
      grade: [null, Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(20),
              Validators.pattern('([a-zA-Z0-9]*$)')])
      ],
      des: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('([a-zA-Z0-9]*$)')])
      ],
      type: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern('([a-zA-Z0-9_]*$)')])
      ]
    });
  }

  cargoFetch() {
    this.auth.getRequest('/cargo-register', null ).subscribe(res => {
      this.cargoList = res.data;
    });
  }

  create() {
    this.formProcessing = true;
    const data = {
          grade: this.cargoReg.get('grade').value,
          type: this.cargoReg.get('type').value,
          description: this.cargoReg.get('des').value
    };
    this.auth.postRequest('/cargo-register/create', data ).subscribe(res => {
      this.modalRef.hide();
      if (!res.success) {
          this.formProcessing = false;
          this.messageClass = 'alert alert-danger';
          this.message = 'Something went wrong!!';
      }else {
          this.cargoFetch();
          this.messageClass = 'alert alert-success';
          this.message = 'New Cargo Has Been Registered :)';
      }
      setTimeout(() => {
        this.messageClass = '';
        this.message = '';
      }, 10000);
    });
  }
  }
