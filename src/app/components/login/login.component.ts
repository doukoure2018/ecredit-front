import { Component, OnInit } from '@angular/core';
import {
  Observable,
  of,
  BehaviorSubject,
  map,
  startWith,
  catchError,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { Key } from '../../enum/key.enum';
import { LoginState } from '../../interfaces/appstates';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });

  private phoneSubject = new BehaviorSubject<string>('');
  private emailSubject = new BehaviorSubject<string>('');

  readonly DataState = DataState;

  isPasswordVisible: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.isAuthenticated()
      ? this.router.navigate(['/'])
      : this.router.navigate(['/lgoin']);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public login(loginForm: NgForm): void {
    this.loginState$ = this.userService
      .login$(loginForm.value.codeUser, loginForm.value.password)
      .pipe(
        map((response) => {
          console.log(response);
          // if isUsingMfa is true
          if (response.data?.user?.usingMfa) {
            // get the phone and the email
            this.phoneSubject.next(response.data.user.phone ?? '');
            this.emailSubject.next(response.data.user.codeUser ?? '');
            return {
              dataState: DataState.LOADED,
              isUsingMfa: true,
              loginSuccess: false,
              phone: this.phoneSubject.value.substring(
                this.phoneSubject.value.length - 4
              ),
            };
          } else {
            // we get to the home component
            // set the access token and the refresh token
            localStorage.setItem(Key.TOKEN, response.data?.access_token ?? '');
            localStorage.setItem(
              Key.REFRESH_TOKEN,
              response.data?.refresh_token ?? ''
            );
            this.router.navigate(['/']);
            return {
              dataState: DataState.LOADED,
              isUsingMfa: false,
              loginSuccess: true,
            };
          }
        }),
        startWith({
          dataState: DataState.LOADING,
          loginSuccess: false,
          isUsingMfa: false,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, loginSuccess: false, error });
        })
      );
  }

  // verify when it comes to usingMFA
  public verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService
      .verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map((response) => {
          const access_token = response.data?.access_token ?? '';
          const refresh_token = response.data?.refresh_token ?? '';
          localStorage.setItem(Key.TOKEN, access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
          this.router.navigate(['/']);
          return { dataState: DataState.LOADED, loginSuccess: true };
        }),
        startWith({
          dataState: DataState.LOADING,
          isUsingMfa: true,
          loginSuccess: false,
          phone: this.phoneSubject.value.substring(
            this.phoneSubject.value.length - 4
          ),
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            isUsingMfa: true,
            loginSuccess: false,
            error,
            phone: this.phoneSubject.value.substring(
              this.phoneSubject.value.length - 4
            ),
          });
        })
      );
  }

  public logingPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
