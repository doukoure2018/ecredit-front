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
import { CustomHttpResponse, DemandeState } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { DemandeIndividuel } from '../../interfaces/demande-individuel';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-demandeindividuel',
  templateUrl: './demandeindividuel.component.html',
  styleUrl: './demandeindividuel.component.css',
})
export class DemandeindividuelComponent implements OnInit {
  demandeIndividuelState$: Observable<State<CustomHttpResponse<DemandeState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<DemandeState> | null>(null);

  private loadingDataSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingDataSubject.asObservable();
  readonly DataState = DataState;

  private readonly DEMANDE_IND: string = 'id';
  private readonly CODE_MEMBRE: string = 'codMembre';

  constructor(
    private individuelService: DemandeIndividuelService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.demandeIndividuelState$ = this.activatedRouter.paramMap.pipe(
      switchMap((param: ParamMap) => {
        const demandeInd = param.get(this.DEMANDE_IND);
        const codMembre = param.get(this.CODE_MEMBRE);
        return this.individuelService.demande$(+demandeInd!, codMembre!).pipe(
          map((response) => {
            console.log(response);
            this.dataSubject.next(response);
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
      })
    );
  }

  public addCreditIndividuel(creditForm: NgForm): void {
    this.loadingDataSubject.next(true);
    this.demandeIndividuelState$ = this.individuelService
      .addCreditIndividuel$(creditForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingDataSubject.next(false);
          this.router.navigate([
            `/confirmedCredit/${response.data?.credit?.referenceCredit}`,
          ]);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          this.loadingDataSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  public cancelDemande(user?: User, demande?: DemandeIndividuel): void {
    console.log('this is the confirmation credit');
  }
}
