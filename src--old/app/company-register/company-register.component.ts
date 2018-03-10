import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent  {
  modalRef: BsModalRef;
  companyReg: FormGroup;
  messageClass: String = null;
  message: String = null;
  companyList = [] ;
  formProcessing: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) { // <--- inject FormBuilder
    this.createForm();
    this.companyFetch();
   }

   companyFetch() {
    this.auth.getRequest('/company-register', null ).subscribe(res => {
      this.companyList = res.data;
    });
  }

  createForm() {
    this.companyReg = this.fb.group({
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
      address: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      address2: [null, Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      address3: [null, Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      city: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ])
      ],
      state: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ],
      zip: [null, Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ],
      country: [null, Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
        ],
      phone: [null, Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
        ]
    });
  }

  create() {
    this.formProcessing = true;
    const data = {
        name: this.companyReg.get('name').value,
        type: this.companyReg.get('type').value,
        address:  this.companyReg.get('address').value,
        address2: this.companyReg.get('address2').value,
        address3: this.companyReg.get('address3').value,
        city: this.companyReg.get('city').value,
        state: this.companyReg.get('state').value,
        country: this.companyReg.get('country').value,
        zip: this.companyReg.get('zip').value,
        phone: this.companyReg.get('phone').value
    };
    console.log(data);
    this.auth.postRequest('/company-register/create', data ).subscribe(res => {
      this.modalRef.hide();
      if (!res.success) {
          this.formProcessing = false;
          this.messageClass = 'alert alert-danger';
          this.message = 'Something went wrong!!';
      }else {
          this.companyFetch();
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
