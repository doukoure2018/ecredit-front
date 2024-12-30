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
import {
  CustomHttpResponse,
  DetailCreditIndState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmedCreditInd } from '../../interfaces/confirmed-credit-ind';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargesInd } from '../../interfaces/charge-ind';
import { ProduitInd } from '../../interfaces/produit-ind';
import { Personnecaution } from '../../interfaces/personne-caution';

@Component({
  selector: 'app-detailcredit',
  templateUrl: './detailcredit.component.html',
  styleUrl: './detailcredit.component.css',
})
export class DetailcreditComponent implements OnInit {
  detailCreditIndState$: Observable<
    State<CustomHttpResponse<DetailCreditIndState>>
  > = new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<DetailCreditIndState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  private readonly REFERENCECREDIT: string = 'referencedcredit';
  private readonly CODMEMBRE: string = 'codMembre';

  // Displaying material tables for the charges
  public dataSourceCharge: MatTableDataSource<ChargesInd> =
    new MatTableDataSource();
  displayedColumnsCharge: string[] = [
    'index',
    'libele',
    'qte',
    'prixUnit',
    'prixTotal',
  ];

  // Displaying material tables for the products
  public dataSourceProduit: MatTableDataSource<ProduitInd> =
    new MatTableDataSource();
  displayedColumnsProduit: string[] = [
    'index',
    'libele',
    'qte',
    'prixUnit',
    'prixTotal',
    'observation',
  ];

  // Displaying material tables
  public dataSourcePersonneCaution: MatTableDataSource<Personnecaution> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    'index',
    'nom',
    'prenom',
    'telephone',
    'profession',
    'activite',
    'age',
  ];

  constructor(
    private individuelService: DemandeIndividuelService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.detailCreditIndState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.individuelService
          .detailCreditCredit$(
            params.get(this.REFERENCECREDIT)!,
            params.get(this.CODMEMBRE)!
          )
          .pipe(
            map((response) => {
              console.log('okokokokok ' + response);
              this.dataSubject.next(response);
              this.dataSourceCharge.data = response.data?.chargeind ?? [];
              this.dataSourceProduit.data = response.data?.produitInd ?? [];
              this.dataSourcePersonneCaution.data =
                response.data?.garantiepersonnecaution ?? [];
              return {
                dataState: DataState.LOADED,
                appData: response,
              };
            }),
            startWith({ dataState: DataState.LOADING }),
            catchError((error: string) => {
              return of({
                dataState: DataState.ERROR,
                error,
                appData: this.dataSubject.value ?? undefined,
              });
            })
          );
      })
    );
  }

  public onSave(): void {}

  public updateData(): void {}

  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
  }

  isPDF(fileUrl: string): boolean {
    return fileUrl.toLowerCase().endsWith('.pdf');
  }

  public confirmedCreditAgent(): void {}
}
