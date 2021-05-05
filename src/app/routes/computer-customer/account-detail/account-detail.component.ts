import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { cleanForm } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { UserService } from 'src/app/services/computer-management/user/user.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.less'],
})
export class AccountDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private nzMessage: NzMessageService,
    private cusService: UserService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.formRegister = fb.group({
      username: [{ value: null, disabled: true }, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+84'],
      phoneNumber: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      sex: [null, [Validators.required]],
    });
    this.formChangePassword = fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }
  avatar = '';
  avatarUrl: any = '';
  userId: any;
  passwordVisible = false;
  password?: string;
  newPasswordVisible = false;
  newPassword?: string;
  confirmPasswordVisible = false;
  confirmPassword?: string;
  baseFileUrl = environment.BASE_FILE_URL;
  uploadUrl = environment.BASE_UPLOAD_URL;
  position: NzTabPosition = 'left';
  formRegister: FormGroup;
  formChangePassword: FormGroup;
  ngOnInit(): void {
    this.fetchUser();
  }
  fetchUser() {
    const userModel = JSON.parse(localStorage.getItem('_token') || '{}');
    if (userModel) {
      this.cusService.getById(userModel.id).subscribe(
        (res) => {
          if (res.code === 200) {
            const data = res.data;
            this.userId = data.id;
            if (data.avatar) {
              this.avatar = data.avatar;
            }
            this.formRegister.controls.username.setValue(data.username);
            this.formRegister.controls.email.setValue(data.email);
            this.formRegister.controls.nickname.setValue(data.name);
            this.formRegister.controls.phoneNumber.setValue(data.phone);
            this.formRegister.controls.dateOfBirth.setValue(data.dateOfBirth);
            this.formRegister.controls.sex.setValue(data.sex);
          }
        },
        (err) => {
          this.nzMessage.error(err.error.message);
        },
      );
    }
  }
  checkConfirmPassword() {
    if (
      String(this.formChangePassword.controls.newPassword.value).toLowerCase().trim() !==
      String(this.formChangePassword.controls.confirmPassword.value).toString().toLowerCase().trim()
    ) {
      this.formChangePassword.controls.confirmPassword.setErrors({ invalidConfirmPw: true });
      return;
    }
  }
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.nzMessage.error('Bạn chỉ có thể tải lên tệp JPG, PNG!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.nzMessage.error('Kích thước tệp không vượt quá 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };
  avatarDisplayUrl = '';
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      this.avatarUrl = info.file.name;
      this.avatarDisplayUrl = this.baseFileUrl + this.avatarUrl;
    }
    if (info.file.status === 'done') {
      this.nzMessage.success(`${info.file.name} tải Avatar thành công`);
    } else if (info.file.status === 'error') {
      this.nzMessage.error(`${info.file.name} tải thất bại.`);
    }
  }
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
      id: this.userId,
      dateOfBirth: this.formRegister.controls.dateOfBirth.value,
      name: this.formRegister.controls.nickname.value,
      email: this.formRegister.controls.email.value,
      phone: this.formRegister.controls.phoneNumber.value,
      sex: this.formRegister.controls.sex.value,
    };
    if (this.avatarUrl !== '') {
      Object.assign(model, { avatar: this.avatarUrl });
    }
    this.cusService.update(model).subscribe(
      (res) => {
        if (res.code === 200) {
          this.nzMessage.success('Cập nhật thành công');
          this.fetchUser();
          this.avatarUrl = '';
          this.cusService.changeUser(true);
        } else {
          this.nzMessage.error('Cập nhật thất bại');
        }
      },
      (err) => {
        this.nzMessage.error('Cập nhật thất bại');
      },
    );
  }
  resetData() {
    this.formChangePassword.reset();
  }
  save() {
    cleanForm(this.formChangePassword);
    // tslint:disable-next-line:forin
    for (const i in this.formChangePassword.controls) {
      this.formChangePassword.controls[i].markAsDirty();
      this.formChangePassword.controls[i].updateValueAndValidity();
    }
    if (this.formChangePassword.invalid) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    const changePwModel = {
      oldPassword: this.formChangePassword.controls.oldPassword.value,
      newPassword: this.formChangePassword.controls.newPassword.value,
      confirmPassword: this.formChangePassword.controls.confirmPassword.value,
    };
    const userModel = this.tokenService.get();
    const UpdateUserModel = {
      userName: userModel?.userName,
      oldPassword: changePwModel.oldPassword,
      newPassword: changePwModel.newPassword,
    };
    this.cusService.changePassword(UpdateUserModel).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.nzMessage.error(`Có lỗi xảy ra: ${res.message}`);
          return;
        }
        this.resetData();
        this.nzMessage.success('Đổi mật khẩu thành công');
      },
      (err) => {
        console.log(err);
        this.nzMessage.error(`Có lỗi xảy ra: ${err.error.message}`);
      },
    );
  }
}
