import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CustomHttpResponse, HomeState } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { RoleState } from '../../enum/rolestate.enum';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  homeState$: Observable<State<CustomHttpResponse<HomeState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<HomeState> | null>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoadingSubject = this.loadingSubject.asObservable();
  public readonly DataState = DataState;
  public readonly RoleState = RoleState;

  private readonly USER_ID: string = 'user_id';

  constructor(
    private demandeIndividuelService: DemandeIndividuelService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.homeState$ = this.demandeIndividuelService.home$().pipe(
      map((response) => {
        console.log('this is the home page');
        console.log(response);
        this.dataSubject.next(response);

        // Route based on role
        if (response.data?.user?.roleName === this.RoleState.ROLE_USER) {
          this.router.navigate(['/homeagent']);
        } else if (response.data?.user?.roleName === this.RoleState.ROLE_DA) {
          this.router.navigate(['/homeda']);
        }
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }
}
