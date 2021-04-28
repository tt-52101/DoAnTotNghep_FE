import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.less'],
})
export class AccountDetailComponent implements OnInit {
  constructor(private fb: FormBuilder, private nzMessage: NzMessageService, private cusService: CustomerService, private router: Router) {
    this.formRegister = fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+84'],
      phoneNumber: [null, [Validators.required]],
      sex: [null, [Validators.required]],
    });
  }
  position: NzTabPosition = 'left';
  formRegister: FormGroup;
  ngOnInit(): void {}
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.formRegister.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.formRegister.controls.checkPassword.updateValueAndValidity());
  }
  submitForm(): void {
    for (const i in this.formRegister.controls) {
      this.formRegister.controls[i].markAsDirty();
      this.formRegister.controls[i].updateValueAndValidity();
    }
    if (this.formRegister.valid) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    let model = {
      name: this.formRegister.controls.nickname.value,
      email: this.formRegister.controls.email.value,
      phone: this.formRegister.controls.phoneNumber.value,
      sex: this.formRegister.controls.sex.value,
    };
    this.cusService.register(model).subscribe(
      (res) => {
        if (res.code === 200) {
          this.nzMessage.success('Chỉnh sửa thành công');
          this.router.navigateByUrl('/login');
        }
      },
      (err) => {
        this.nzMessage.error(err.error.message);
      },
    );
  }
}
