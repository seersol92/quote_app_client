import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vessel-register',
  templateUrl: './vessel-register.component.html',
  styleUrls: ['./vessel-register.component.css']
})
export class VesselRegisterComponent  {
  modalRef: BsModalRef;
  vesselFrom: FormGroup;
  messageClass: String = null;
  message: String = null;
  vesselList = [] ;
  formProcessing: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) { // <--- inject FormBuilder
    this.createForm();
    this.vesselFetch();
   }
   vesselFetch() {
    this.auth.getRequest('/vessel-register', null ).subscribe(res => {
      this.vesselList = res.data;
    });
  }

  createForm() {
    this.vesselFrom = this.fb.group({
      name: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      type: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      owner: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      imo: [null, Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      flag: [null, Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ]
    });
  }

  create() {
    this.formProcessing = true;
    const data = {
        name: this.vesselFrom.get('name').value,
        type: this.vesselFrom.get('type').value,
        own:  this.vesselFrom.get('owner').value,
        imo:  this.vesselFrom.get('imo').value,
        flag: this.vesselFrom.get('flag').value
    };
    this.auth.postRequest('/vessel-register/create', data ).subscribe(res => {
      this.modalRef.hide();
      if (!res.success) {
          this.formProcessing = false;
          this.messageClass = 'alert alert-danger';
          this.message = 'Something went wrong!!';
      }else {
          this.vesselFetch();
          this.messageClass = 'alert alert-success';
          this.message = 'New Company Has Been Registered :)';
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