import { Inject, Injectable } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { categoryRouter, customerRouter } from '@util';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: _HttpClient, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {}
  private isLoginSource = new BehaviorSubject(this.tokenService.get()?.token ? true : false);
  isLoginCurrent = this.isLoginSource.asObservable();
  changeLogin(isLogin: any) {
    this.isLoginSource.next(isLogin);
  }
  login(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + customerRouter.getToken, model);
  }
  register(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + customerRouter.register + environment.ALLOW_ANONYMOUS, model);
  }
}
