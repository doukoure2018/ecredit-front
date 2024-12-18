import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CustomHttpResponse, DemandeState } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { response } from 'express';
import { MatTableDataSource } from '@angular/material/table';
import { DemandeIndividuel } from '../../interfaces/demande-individuel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listedemandeindividuel',
  templateUrl: './listedemandeindividuel.component.html',
  styleUrl: './listedemandeindividuel.component.css',
})
export class ListedemandeindividuelComponent implements OnInit {
  demandeIndividuelState$: Observable<State<CustomHttpResponse<DemandeState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<DemandeState> | null>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoadingSubject = this.loadingSubject.asObservable();

  readonly DataState = DataState;

  // material table
  public dataSource: MatTableDataSource<DemandeIndividuel> =
    new MatTableDataSource();
  // displayedColomns
  displayedColumns: string[] = [
    'index',
    'createdAt',
    'nom',
    'prenom',
    'telephone',
    'numeroMembre',
    'montant',
    'activite',
    'statutDemande',
    'action',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // this is optional
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private individuelService: DemandeIndividuelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.demandeIndividuelState$ = this.individuelService
      .listDemandeIndividuel$()
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.dataSource.data = response.data?.demandes ?? [];
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
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

  public selectDemande(demande: DemandeIndividuel): void {
    console.log(demande.numeroMembre);
    this.router.navigate([`/demande/${demande.id}/${demande.numeroMembre}`]);
  }
}
