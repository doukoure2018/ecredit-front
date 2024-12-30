import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CreditState, CustomHttpResponse } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { response } from 'express';
import { Credit } from '../../interfaces/credit';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creditview',
  templateUrl: './creditview.component.html',
  styleUrl: './creditview.component.css',
})
export class CreditviewComponent implements OnInit {
  creditState$: Observable<State<CustomHttpResponse<CreditState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<CreditState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoadingSubject = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  // Displaying material tables
  public dataSourceCredit: MatTableDataSource<Credit> =
    new MatTableDataSource();
  displayedColumns: string[] = ['index', 'codeMembre', 'action'];

  constructor(
    private creditService: DemandeIndividuelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.creditState$ = this.creditService.creditView$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        this.dataSourceCredit.data = response.data?.credit ?? [];
        return {
          dataState: DataState.LOADED,
          appData: response,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  viewDetail(credit: Credit): void {
    this.router.navigate([
      `/detailcredit/${credit.referenceCredit}/${credit.codeMembre}`,
    ]);
  }
}
