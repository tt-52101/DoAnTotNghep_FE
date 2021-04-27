import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { categoryRouter, customerRouter } from '@util';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: _HttpClient) {}
  private isLoginSource = new BehaviorSubject(false);
  isLoginCurrent = this.isLoginSource.asObservable();
  changeLogin(isLogin: any) {
    this.isLoginSource.next(isLogin);
  }
  login(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + customerRouter.getToken, model);
  }
}
