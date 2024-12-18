import { Component, OnInit } from '@angular/core';
import {
  CustomHttpResponse,
  ProduitIndState,
} from '../../interfaces/appstates';
import { State } from '../../interfaces/state';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProduitInd } from '../../interfaces/produit-ind';

@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrl: './vente.component.css',
})
export class VenteComponent implements OnInit {
  venteState$: Observable<State<CustomHttpResponse<ProduitIndState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<ProduitIndState> | null>(null);
  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  public readonly DataState = DataState;

  venteIndForm!: FormGroup;
  private readonly REFERENCE_CREDIT: string = 'referencedcredit';

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  // referenceId
  private referenceId!: string;

  // Displaying material tables
  public dataSource: MatTableDataSource<ProduitInd> = new MatTableDataSource();
  displayedColumns: string[] = [
    'index',
    'libele',
    'qte',
    'prixUnit',
    'prixTotal',
    'observation',
    'action',
  ];
  constructor(
    private fb: FormBuilder,
    private indService: DemandeIndividuelService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // get first the value
    this.referenceId =
      this.activatedRouter.snapshot.paramMap.get('referencedcredit') || '';
    this.venteIndForm = this.fb.group({
      libele: ['', Validators.required],
      referenceCredit: [''],
      prixUnit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      qte: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      observation: [''],
    });
    // set the reference value as default
    this.venteIndForm.patchValue({ referenceCredit: this.referenceId });

    /**
     * Display Information
     */
    this.venteState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.indService
          .produitInd$(params.get(this.REFERENCE_CREDIT)!)
          .pipe(
            map((response) => {
              this.dataSubject.next(response);
              console.log(response.data?.produitInd);
              this.dataSource.data = response.data?.produitInd ?? [];
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
      })
    );
  }

  public onSave(): void {
    this.venteState$ = this.activatedRouter.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.indService
          .addProduitInd$(this.referenceId, this.venteIndForm.value)
          .pipe(
            map((response) => {
              console.log(response);
              this.dataSubject.next(response);
              this.dataSource.data = response.data?.produitInd ?? [];
              this.venteIndForm.reset();
              return {
                dataState: DataState.LOADED,
                appData: this.dataSubject.value ?? undefined,
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

  public onSaveAndContinue(): void {}

  public updateVenteInd(): void {}

  public goNext(): void {
    this.router.navigate([`/frequence/${this.referenceId}`]);
  }

  public goBack(): void {
    this.router.navigate([`/charge/${this.referenceId}`]);
  }
}
