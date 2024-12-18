import { Component, OnInit } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { RoleState } from '../../enum/rolestate.enum';
import { CustomHttpResponse, HomeState } from '../../interfaces/appstates';
import { State } from '../../interfaces/state';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Credit } from '../../interfaces/credit';
import { Individuel } from '../../interfaces/individuel';

@Component({
  selector: 'app-homeda',
  templateUrl: './homeda.component.html',
  styleUrl: './homeda.component.css',
})
export class HomedaComponent implements OnInit {
  homeDaState$: Observable<State<CustomHttpResponse<HomeState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<HomeState> | null>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoadingSubject = this.loadingSubject.asObservable();
  public readonly DataState = DataState;
  public readonly RoleState = RoleState;

  // declare the selectedIndividuel
  public selectedIndividuel$: Observable<Individuel | null> = of(null);

  constructor(
    private demandeIndividuelService: DemandeIndividuelService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.homeDaState$ = this.demandeIndividuelService.home$().pipe(
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
  }

  private loadedIndividuelCache: { [key: string]: Individuel } = {}; // Cache for loaded data

  public getIndividuel(codeMembre: string): void {
    if (this.loadedIndividuelCache[codeMembre]) {
      // Use cached data if already loaded
      this.selectedIndividuel$ = of(this.loadedIndividuelCache[codeMembre]);
    } else {
      // Fetch data if not cached
      this.selectedIndividuel$ = this.demandeIndividuelService
        .getindividuel$(codeMembre)
        .pipe(
          map((response) => {
            const data = response?.data ?? null;
            if (data) {
              this.loadedIndividuelCache[codeMembre] = data; // Store in cache
            }
            return data;
          }),
          catchError(() => of(null))
        );
    }
  }

  public updateChargeInd(): void {}
}
