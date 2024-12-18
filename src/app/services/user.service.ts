import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  CustomHttpResponse,
  HomeState,
  Profile,
} from '../interfaces/appstates';
import { Key } from '../enum/key.enum';
import { User } from '../interfaces/user';
import { SettingForm } from '../interfaces/setting';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly server: string = 'http://127.0.0.1:8082/auth/ecredit';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  homeReport$ = (
    start: string,
    end: string
  ): Observable<CustomHttpResponse<HomeState>> =>
    this.http
      .get<CustomHttpResponse<HomeState>>(
        `${this.server}/home?start=${start}&end=${end}`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError((error) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );

  /**
   *
   * @param codeUser
   * @param password
   * @returns
   */
  login$ = (codeUser: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>this.http
      .post<CustomHttpResponse<Profile>>(
        `${this.server}/login`,
        {
          codeUser,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   *  for user profile
   * @returns
   */
  profile$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(`${this.server}/profile`)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  /**
   *
   * @param user
   * @returns
   * Update user information
   */
  update$ = (user: User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/update`, user)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  /**
   *
   * @param form
   * Update  Password when user is logged in
   * @returns
   */
  updatePassword$ = (form: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/password`,
          form
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param roleName
   * @returns
   * Update UserRole
   */
  updateRole$ = (roleName: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/role/${roleName}`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @param settings
   * Update Settings
   * @returns
   */
  updateSetting$ = (settings: SettingForm) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/settings`,
          settings
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @returns
   * if user  need to use MFA
   */
  toggleMfa$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(`${this.server}/togglemfa`, {})
        .pipe(tap(console.log), catchError(this.handleError))
    );
  /**
   * Update image profile fonctionnality
   * @param formData
   * @returns
   */
  updateImage$ = (formData: FormData) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<CustomHttpResponse<Profile>>(
          `${this.server}/update/image`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Fonctionnality for refresh token
   * @returns
   */
  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>this.http
      .get<CustomHttpResponse<Profile>>(`${this.server}/refresh/token`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}`,
        },
      })
      .pipe(
        tap((response) => {
          const access_token = response.data?.access_token ?? '';
          const refresh_token = response.data?.refresh_token ?? '';
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, refresh_token);
        }),
        catchError(this.handleError)
      );
  /**
   * Fonctionnality to verify the code
   * @param email
   * @param code
   * @returns
   */
  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *
   * @returns
   * Chech whether user is logged or not
   */
  isAuthenticated = (): boolean => {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(Key.TOKEN);

      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      }
    }
    return false;
  };

  /**
   *  Functionnaly for logout
   */
  logOut(): void {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }
  /**
   * Error Handler fonctionnality
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.log(error.error);
      errorMessage = `A client error occured - ${error.error.message}`;
    } else {
      if (error.error.message) {
        errorMessage = error.error.message;
        console.log(error.error.reason);
      } else if (error.error) {
        const errorKeys = Object.keys(error.error);
        if (errorKeys.length > 0) {
          const key = errorKeys[0];
          errorMessage = error.error[key];
          console.log(`${key}: ${error.error[key]}`);
        } else {
          errorMessage = `An error occurred - Error status ${error.status}`;
        }
      } else {
        errorMessage = `An error Occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
